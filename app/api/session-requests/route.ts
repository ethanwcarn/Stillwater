import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSessionUserFromRequest } from '@/lib/session'

type PgError = {
  code?: string
}

const ALLOWED_TIMES = new Set<string>()
for (let minutes = 8 * 60; minutes <= 18 * 60; minutes += 30) {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  ALLOWED_TIMES.add(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
}

function isPgError(error: unknown): error is PgError {
  return typeof error === 'object' && error !== null && 'code' in error
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUserFromRequest(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const therapistId = Number(body?.therapistId)
    const sessionDate = typeof body?.sessionDate === 'string' ? body.sessionDate : ''
    const sessionTime = typeof body?.sessionTime === 'string' ? body.sessionTime : ''

    if (!Number.isInteger(therapistId) || !sessionDate || !sessionTime) {
      return NextResponse.json(
        { error: 'therapistId, sessionDate, and sessionTime are required' },
        { status: 400 }
      )
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(sessionDate)) {
      return NextResponse.json({ error: 'Invalid session date format' }, { status: 400 })
    }

    if (!/^\d{2}:\d{2}$/.test(sessionTime) || !ALLOWED_TIMES.has(sessionTime)) {
      return NextResponse.json(
        { error: 'Invalid session time. Use 30 minute increments from 8:00 AM to 6:00 PM.' },
        { status: 400 }
      )
    }

    const parsedDate = new Date(`${sessionDate}T00:00:00Z`)
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid session date' }, { status: 400 })
    }

    const therapistResult = await query<{ id: number }>(
      'SELECT id FROM therapists WHERE id = $1',
      [therapistId]
    )
    if (therapistResult.rows.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    const insertResult = await query<{ id: number }>(
      `INSERT INTO requested_sessions (user_id, therapist_id, session_date, session_time)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [sessionUser.id, therapistId, sessionDate, sessionTime]
    )

    return NextResponse.json({ id: insertResult.rows[0].id }, { status: 201 })
  } catch (error) {
    if (isPgError(error) && error.code === '23505') {
      return NextResponse.json(
        { error: 'That provider already has a requested session at that date and time.' },
        { status: 409 }
      )
    }

    console.error('POST /api/session-requests error:', error)
    return NextResponse.json(
      { error: 'Failed to create session request' },
      { status: 500 }
    )
  }
}
