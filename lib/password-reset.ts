import { createHash, randomBytes } from 'crypto'

export const PASSWORD_RESET_TOKEN_TTL_MINUTES = 10

export function generatePasswordResetToken() {
  return randomBytes(32).toString('hex')
}

export function hashPasswordResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function getPasswordResetExpiresAt() {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + PASSWORD_RESET_TOKEN_TTL_MINUTES)
  return expiresAt
}

export function buildPasswordResetLink(origin: string, token: string) {
  const resetUrl = new URL('/reset-password', origin)
  resetUrl.searchParams.set('token', token)
  return resetUrl.toString()
}
