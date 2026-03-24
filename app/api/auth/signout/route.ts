import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie, deleteSessionByToken, SESSION_COOKIE_NAME } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (token) {
      await deleteSessionByToken(token)
    }

    const response = NextResponse.json({ ok: true })
    clearSessionCookie(response)
    return response
  } catch (error) {
    console.error('POST /api/auth/signout error:', error)
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 })
  }
}
