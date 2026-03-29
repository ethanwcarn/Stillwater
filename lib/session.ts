import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const SESSION_COOKIE_NAME = 'stillwaters_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

type CookieStoreLike = {
  get: (name: string) => { value: string } | undefined
}

export type SessionUser = {
  id: number
  email: string
  display_name: string | null
}

function getSessionCookieConfig() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  }
}

function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function createSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const sessionHash = hashSessionToken(sessionToken)
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)

  await query(
    `INSERT INTO user_sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, sessionHash, expiresAt.toISOString()]
  )

  return sessionToken
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await query('DELETE FROM user_sessions WHERE token_hash = $1', [hashSessionToken(token)])
}

export async function getSessionUserByToken(token: string): Promise<SessionUser | null> {
  const result = await query<SessionUser>(
    `SELECT u.id, u.email, u.display_name
     FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > NOW()
     LIMIT 1`,
    [hashSessionToken(token)]
  )

  return result.rows[0] ?? null
}

export async function getSessionUserFromCookieStore(
  cookieStore: CookieStoreLike
): Promise<SessionUser | null> {
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return getSessionUserByToken(token)
}

export async function getSessionUserFromRequest(
  request: NextRequest
): Promise<SessionUser | null> {
  return getSessionUserFromCookieStore(request.cookies)
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieConfig())
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...getSessionCookieConfig(),
    maxAge: 0,
  })
}
