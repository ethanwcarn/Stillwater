'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/providers'
import { cn } from '@/lib/utils'

type Mode = 'signin' | 'signup'

type SignInFormProps = {
  initialAuthMode?: Mode
  initiallyOpen?: boolean
  passwordResetSuccess?: boolean
}

export function SignInForm({
  initialAuthMode = 'signin',
  initiallyOpen = false,
  passwordResetSuccess = false,
}: SignInFormProps) {
  const { userEmail, signIn, signUp, signOut } = useAuth()
  const [mode, setMode] = useState<Mode>(initialAuthMode)
  const [showForm, setShowForm] = useState(initiallyOpen || passwordResetSuccess)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sendingResetLink, setSendingResetLink] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  useEffect(() => {
    if (initialAuthMode === 'signin' || initialAuthMode === 'signup') {
      setMode(initialAuthMode)
      setShowForm(initiallyOpen || passwordResetSuccess)
    } else if (passwordResetSuccess) {
      setMode('signin')
      setShowForm(true)
    }

    if (passwordResetSuccess) {
      setError(null)
      setMessage('Your password has been reset. Sign in with your new password.')
      setPassword('')
      setConfirmPassword('')
    }
  }, [initialAuthMode, initiallyOpen, passwordResetSuccess])

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
    setMessage(null)
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setPassword('')
    setConfirmPassword('')
  }

  function validateForm() {
    let isValid = true

    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setError(null)

    if (!email.trim()) {
      setEmailError('Email is required.')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.')
      isValid = false
    }

    if (!password.trim()) {
      setPasswordError('Password is required.')
      isValid = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.')
      isValid = false
    }

    if (mode === 'signup') {
      if (!confirmPassword.trim()) {
        setConfirmPasswordError('Please confirm your password.')
        isValid = false
      } else if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match.')
        isValid = false
      }
    }

    return isValid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!validateForm()) return

    setSubmitting(true)
    const err =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password, displayName || undefined)
    setSubmitting(false)

    if (err) setError(err)
  }

  async function handleForgotPassword() {
    setError(null)
    setMessage(null)

    if (!email.trim()) {
      setError('Enter your email first')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setSendingResetLink(true)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json().catch(() => null)
    setSendingResetLink(false)

    if (!res.ok) {
      setError(data?.error ?? 'Unable to send the password reset email')
      return
    }

    setMessage(
      data?.message ?? 'If an account exists for that email, we sent a password reset link.'
    )
  }

  const inputClass = (hasError = false) =>
    cn(
      'mt-1 w-full rounded border bg-background px-3 py-2 text-foreground',
      'focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring',
      hasError ? 'border-red-500' : 'border-input'
    )

  const isBusy = submitting || sendingResetLink

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
          <div className="mt-4 flex gap-4 border-b border-border">
            <button
              type="button"
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
              type="button"
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
                  className={inputClass()}
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
                className={inputClass(!!emailError)}
                placeholder="you@example.com"
              />
              {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
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
                className={inputClass(!!passwordError)}
                placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
              />
              {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
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
                  className={inputClass(!!confirmPasswordError)}
                  placeholder="Repeat password"
                />
                {confirmPasswordError && (
                  <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>
                )}
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-primary">{message}</p>}

            <button
              type="submit"
              disabled={isBusy}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? mode === 'signin'
                  ? 'Signing in…'
                  : 'Creating account…'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>

            {mode === 'signin' && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isBusy}
                className="block text-sm text-primary hover:underline disabled:opacity-50"
              >
                {sendingResetLink ? 'Sending reset link…' : 'Forgot password?'}
              </button>
            )}
          </form>
        </>
      )}
    </div>
  )
}