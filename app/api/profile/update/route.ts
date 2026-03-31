import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionUserFromCookieStore } from '@/lib/session'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const sessionUser = await getSessionUserFromCookieStore(cookieStore)

  if (!sessionUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { display_name, faith_tradition } = await request.json()

    await query(
      `UPDATE users 
       SET display_name = $1, faith_tradition = $2 
       WHERE id = $3`,
      [display_name, faith_tradition, sessionUser.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}