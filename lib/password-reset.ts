import { createHash, randomBytes } from 'crypto'

export const PASSWORD_RESET_TOKEN_TTL_MINUTES = 10
const DEFAULT_PRODUCTION_APP_ORIGIN = 'https://stillwaters.alijahwhitney.dev'

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

function getPasswordResetOrigin(requestOrigin: string) {
  const configuredOrigin = process.env.APP_ORIGIN?.trim()

  if (configuredOrigin) {
    return configuredOrigin
  }

  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_PRODUCTION_APP_ORIGIN
  }

  return requestOrigin
}

export function buildPasswordResetLink(requestOrigin: string, token: string) {
  const resetUrl = new URL('/reset-password', getPasswordResetOrigin(requestOrigin))
  resetUrl.searchParams.set('token', token)
  return resetUrl.toString()
}
