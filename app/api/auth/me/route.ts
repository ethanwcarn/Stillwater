import { NextRequest, NextResponse } from 'next/server'
import { getSessionUserFromRequest } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
    })
  } catch (error) {
    console.error('GET /api/auth/me error:', error)
    return NextResponse.json({ error: 'Failed to load current user' }, { status: 500 })
  }
}
