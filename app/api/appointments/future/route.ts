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
    `SELECT id, title, date, time, description 
     FROM appointments 
     WHERE user_id = $1 AND date >= CURRENT_DATE 
     ORDER BY date ASC, time ASC 
     LIMIT 10`,
    [sessionUser.id]
  )

  return NextResponse.json(result.rows)
}