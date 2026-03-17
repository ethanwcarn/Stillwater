import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { email, password, displayName } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const existing = await query<{ id: number }>(
    'SELECT id FROM users WHERE email = $1',
    [email]
  )

  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const name = displayName?.trim() || email.split('@')[0]

  const result = await query<{ id: number; email: string; display_name: string }>(
    'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name',
    [email, passwordHash, name]
  )

  const user = result.rows[0]
  return NextResponse.json(
    { id: user.id, email: user.email, displayName: user.display_name },
    { status: 201 }
  )
}
