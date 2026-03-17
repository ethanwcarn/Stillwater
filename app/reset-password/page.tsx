import Link from 'next/link'
import { ResetPasswordForm } from '@/components/reset-password-form'
import { query } from '@/lib/db'
import { PASSWORD_RESET_TOKEN_TTL_MINUTES } from '@/lib/password-reset'
import { hashPasswordResetToken } from '@/lib/password-reset'

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[]
  }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams
  const token = Array.isArray(params.token) ? params.token[0] : params.token ?? ''
  const trimmedToken = token.trim()
  const validToken =
    trimmedToken.length > 0 &&
    (
      await query<{ id: number }>(
        `SELECT id
         FROM password_reset_tokens
         WHERE token_hash = $1
           AND used_at IS NULL
           AND expires_at > NOW()
         LIMIT 1`,
        [hashPasswordResetToken(trimmedToken)]
      )
    ).rows.length > 0

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Stillwaters
          </Link>
          <h1 className="text-3xl font-semibold text-foreground">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter a new password for the account tied to your email link. Reset links expire
            after {PASSWORD_RESET_TOKEN_TTL_MINUTES} minutes.
          </p>
        </div>

        {validToken ? (
          <ResetPasswordForm token={trimmedToken} />
        ) : (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm text-destructive">
              This password reset link is invalid or has expired.
            </p>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link href="/?auth=signin" className="text-primary hover:underline">
                Return to sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
