'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

type PasswordResetRequestFormProps = {
  initialEmail?: string
}

export function PasswordResetRequestForm({
  initialEmail = '',
}: PasswordResetRequestFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const inputClass = cn(
    'mt-1 w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground shadow-sm transition',
    'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address')
      return
    }

    setSubmitting(true)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail }),
    })

    const data = await res.json().catch(() => null)
    setSubmitting(false)

    if (!res.ok) {
      setError(data?.error ?? 'Unable to send the password reset email')
      return
    }

    setMessage(
      data?.message ?? 'If an account exists for that email, we sent a password reset link.'
    )
  }

  return (
    <div className="rounded-[28px] border border-border/60 bg-card/95 p-6 shadow-[0_24px_80px_-48px_hsl(var(--foreground)/0.55)] backdrop-blur md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Mail className="h-5 w-5" />
      </div>

      <div className="mt-5 space-y-2">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Email me a reset link</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We&apos;ll send instructions to the address you use to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Sending link…' : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link href="/signin" className="font-medium text-accent hover:underline">
          Return to sign in
        </Link>
      </p>
    </div>
  )
}
