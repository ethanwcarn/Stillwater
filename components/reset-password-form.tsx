'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const resetToken = token.trim()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const inputClass = cn(
    'mt-1 w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground shadow-sm transition',
    'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!resetToken) {
      setError('This password reset link is missing a token')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetToken, password }),
    })

    const data = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok) {
      setError(data?.error ?? 'Unable to reset password')
      return
    }

    router.push('/signin?passwordReset=success')
  }

  return (
    <div className="rounded-[28px] border border-border/60 bg-card/95 p-6 shadow-[0_24px_80px_-48px_hsl(var(--foreground)/0.55)] backdrop-blur md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <KeyRound className="h-5 w-5" />
      </div>

      <div className="mt-5 space-y-2">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Choose a new password</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Create a fresh password with at least 8 characters, then head back to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
            placeholder="Repeat your new password"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !resetToken}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Resetting password…' : 'Reset password'}
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
