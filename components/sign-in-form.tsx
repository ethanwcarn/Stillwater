'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { cn } from '@/lib/utils'

export function SignInForm() {
  const { userEmail, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('sarah@example.com')
  const [password, setPassword] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function validateForm() {
    let isValid = true

    setEmailError('')
    setPasswordError('')

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required.')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.')
      isValid = false
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required.')
      isValid = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.')
      isValid = false
    }

    return isValid
  }

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

  return (
    <div className="rounded-lg border bg-card p-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="text-sm font-medium text-primary hover:underline"
      >
        {showForm ? 'Hide sign in' : 'Sign in (mock auth)'}
      </button>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault()

            if (!validateForm()) return

            signIn(email, password)
          }}
          className="mt-4 space-y-3"
        >
          <div>
            <label htmlFor="email" className="block text-sm text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'mt-1 w-full rounded border bg-background px-3 py-2 text-foreground',
                'focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring',
                emailError ? 'border-red-500' : 'border-input'
              )}
              placeholder="sarah@example.com"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
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
              className={cn(
                'mt-1 w-full rounded border bg-background px-3 py-2 text-foreground',
                'focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring',
                passwordError ? 'border-red-500' : 'border-input'
              )}
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      )}
    </div>
  )
}