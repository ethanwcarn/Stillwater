import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { createSession, setSessionCookie } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const result = await query<{
    id: number
    email: string
    password_hash: string
    display_name: string
  }>(
    'SELECT id, email, password_hash, display_name FROM users WHERE email = $1',
    [email]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const user = result.rows[0]

  if (!user.password_hash) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const sessionToken = await createSession(user.id)
  const response = NextResponse.json({ id: user.id, email: user.email, displayName: user.display_name })
  setSessionCookie(response, sessionToken)
  return response
}
