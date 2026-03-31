import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUserFromCookieStore } from '@/lib/session'
import { query } from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const sessionUser = await getSessionUserFromCookieStore(cookieStore)

  if (!sessionUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await query(
    'SELECT id, email, display_name, faith_tradition, created_at FROM users WHERE id = $1',
    [sessionUser.id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}