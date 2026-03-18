import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { withTransaction } from '@/lib/db'
import { hashPasswordResetToken } from '@/lib/password-reset'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!token || !password) {
    return NextResponse.json(
      { error: 'Token and new password are required' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const tokenHash = hashPasswordResetToken(token)

  const resetApplied = await withTransaction(async (client) => {
    const tokenResult = await client.query<{ id: number; user_id: number }>(
      `SELECT id, user_id
       FROM password_reset_tokens
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [tokenHash]
    )

    if (tokenResult.rows.length === 0) {
      return false
    }

    const resetToken = tokenResult.rows[0]

    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      passwordHash,
      resetToken.user_id,
    ])
    await client.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [
      resetToken.id,
    ])
    await client.query('DELETE FROM password_reset_tokens WHERE user_id = $1 AND id <> $2', [
      resetToken.user_id,
      resetToken.id,
    ])

    return true
  })

  if (!resetApplied) {
    return NextResponse.json(
      { error: 'This password reset link is invalid or has expired' },
      { status: 400 }
    )
  }

  return NextResponse.json({ message: 'Your password has been reset successfully' })
}
