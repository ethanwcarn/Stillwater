import { NextRequest, NextResponse } from 'next/server'
import { query, withTransaction } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/mailgun'
import {
  buildPasswordResetLink,
  generatePasswordResetToken,
  getPasswordResetExpiresAt,
  hashPasswordResetToken,
} from '@/lib/password-reset'

const PASSWORD_RESET_SENT_MESSAGE =
  'If an account exists for that email, we sent a password reset link.'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const userResult = await query<{ id: number; email: string }>(
    'SELECT id, email FROM users WHERE email = $1 LIMIT 1',
    [email]
  )

  if (userResult.rows.length === 0) {
    return NextResponse.json({ message: PASSWORD_RESET_SENT_MESSAGE })
  }

  const user = userResult.rows[0]
  const token = generatePasswordResetToken()
  const tokenHash = hashPasswordResetToken(token)
  const expiresAt = getPasswordResetExpiresAt()

  await withTransaction(async (client) => {
    await client.query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1 OR expires_at <= NOW() OR used_at IS NOT NULL',
      [user.id]
    )
    await client.query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    )
  })

  try {
    await sendPasswordResetEmail({
      recipientEmail: user.email,
      resetPasswordLink: buildPasswordResetLink(req.nextUrl.origin, token),
    })
  } catch (error) {
    await query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash])
    console.error('Failed to send password reset email', error)
    return NextResponse.json(
      { error: 'Unable to send the password reset email right now' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: PASSWORD_RESET_SENT_MESSAGE })
}
