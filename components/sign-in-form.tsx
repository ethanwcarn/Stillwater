'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { cn } from '@/lib/utils'

type Mode = 'signin' | 'signup'

export function SignInForm() {
  const { userEmail, signIn, signUp, signOut } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (userEmail) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{userEmail}</span>
        </p>
        <button
          onClick={signOut}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Sign out
        </button>
      </div>
    )
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setPassword('')
    setConfirmPassword('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const err =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password, displayName || undefined)
    setLoading(false)

    if (err) setError(err)
  }

  const inputClass = cn(
    'mt-1 w-full rounded border bg-background px-3 py-2 text-foreground',
    'border-input focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'
  )

  return (
    <div className="rounded-lg border bg-card p-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="text-sm font-medium text-primary hover:underline"
      >
        {showForm ? 'Hide' : 'Sign in / Create account'}
      </button>

      {showForm && (
        <>
          {/* Tab toggle */}
          <div className="mt-4 flex gap-4 border-b border-border">
            <button
              onClick={() => switchMode('signin')}
              className={cn(
                'pb-2 text-sm font-medium',
                mode === 'signin'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Sign in
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={cn(
                'pb-2 text-sm font-medium',
                mode === 'signup'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {mode === 'signup' && (
              <div>
                <label htmlFor="displayName" className="block text-sm text-muted-foreground">
                  Display name <span className="text-xs">(optional)</span>
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
                placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-muted-foreground">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Repeat password"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
