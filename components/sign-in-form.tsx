'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { cn } from '@/lib/utils'

export function SignInForm() {
  const { userEmail, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('sarah@example.com')
  const [password, setPassword] = useState('')
  const [showForm, setShowForm] = useState(false)

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
                'border-input focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'
              )}
              placeholder="sarah@example.com"
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
              className={cn(
                'mt-1 w-full rounded border bg-background px-3 py-2 text-foreground',
                'border-input focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'
              )}
              placeholder="(any password works)"
            />
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
