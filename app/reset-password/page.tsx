import Link from 'next/link'
import { ArrowLeft, Clock3, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { ResetPasswordForm } from '@/components/reset-password-form'
import { PasswordResetRequestForm } from '@/components/password-reset-request-form'
import { query } from '@/lib/db'
import { PASSWORD_RESET_TOKEN_TTL_MINUTES } from '@/lib/password-reset'
import { hashPasswordResetToken } from '@/lib/password-reset'

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[]
    email?: string | string[]
  }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams
  const token = Array.isArray(params.token) ? params.token[0] : params.token ?? ''
  const email = Array.isArray(params.email) ? params.email[0] : params.email ?? ''
  const trimmedToken = token.trim()
  const initialEmail = email.trim()

  let validToken = false

  if (trimmedToken.length > 0) {
    validToken =
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
  }

  const isRequestFlow = trimmedToken.length === 0
  const eyebrow = isRequestFlow ? 'Account recovery' : validToken ? 'Secure reset' : 'Link expired'
  const title = isRequestFlow
    ? 'Forgot your password?'
    : validToken
      ? 'Reset your password'
      : 'This reset link has expired'
  const description = isRequestFlow
    ? 'Enter the email tied to your account and we will send a secure password reset link.'
    : validToken
      ? `Choose a new password for your account. Reset links expire after ${PASSWORD_RESET_TOKEN_TTL_MINUTES} minutes.`
      : `Reset links are only valid for ${PASSWORD_RESET_TOKEN_TTL_MINUTES} minutes and can only be used once. Request a fresh one to continue.`

  return (
    <main className="animate-fade-in relative min-h-screen overflow-hidden bg-gradient-to-br from-secondary/10 via-background to-primary/10 px-4 py-12 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--secondary)/0.18),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.14),transparent_40%)]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <section className="rounded-[32px] border border-border/60 bg-card/80 p-8 shadow-[0_24px_80px_-52px_hsl(var(--foreground)/0.55)] backdrop-blur md:p-10">
            <Link href="/signin" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>

            <div className="mt-8">
              <span className="inline-flex rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {eyebrow}
              </span>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-foreground">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/70 p-4">
                {isRequestFlow ? (
                  <Mail className="mt-0.5 h-5 w-5 text-primary" />
                ) : validToken ? (
                  <KeyRound className="mt-0.5 h-5 w-5 text-primary" />
                ) : (
                  <Clock3 className="mt-0.5 h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isRequestFlow ? 'Check your inbox next' : validToken ? 'Set it once and continue' : 'Request a fresh link'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {isRequestFlow
                      ? 'If the account exists, the email will arrive with a secure link that opens this page.'
                      : validToken
                        ? 'Once submitted, your old password stops working and you can sign in with the new one.'
                        : 'Used or expired links are rejected automatically for safety.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/70 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Protected by one-time tokens</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Reset links expire after {PASSWORD_RESET_TOKEN_TTL_MINUTES} minutes and become invalid immediately after use.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            {isRequestFlow ? (
              <PasswordResetRequestForm initialEmail={initialEmail} />
            ) : validToken ? (
              <ResetPasswordForm token={trimmedToken} />
            ) : (
              <div className="rounded-[28px] border border-border/60 bg-card/95 p-6 shadow-[0_24px_80px_-48px_hsl(var(--foreground)/0.55)] backdrop-blur md:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div className="mt-5 space-y-2">
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    This link can’t be used anymore
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The reset token is missing, expired, or already used. Request another email and we’ll send you a fresh link.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={initialEmail ? `/reset-password?email=${encodeURIComponent(initialEmail)}` : '/reset-password'}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    Request a new link
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    Return to sign in
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
