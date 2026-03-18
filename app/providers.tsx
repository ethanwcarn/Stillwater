'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type AuthContextType = {
  userEmail: string | null
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string, displayName?: string) => Promise<string | null>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getInitialUserEmail(): string | null {
  if (typeof window === 'undefined') return null

  // Prefer cookie so it survives full reloads and multiple tabs
  const cookieMatch = document.cookie.match(/(?:^|;\s*)userEmail=([^;]+)/)
  if (cookieMatch?.[1]) {
    try {
      return decodeURIComponent(cookieMatch[1])
    } catch {
      return cookieMatch[1]
    }
  }

  return null
}

function setUserEmailCookie(email: string | null) {
  if (typeof window === 'undefined') return

  if (email) {
    // Persist for 7 days
    const maxAgeSeconds = 60 * 60 * 24 * 7
    document.cookie = `userEmail=${encodeURIComponent(email)}; path=/; max-age=${maxAgeSeconds}`
  } else {
    // Clear cookie
    document.cookie = 'userEmail=; path=/; max-age=0'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(() => getInitialUserEmail())

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      return data.error ?? 'Sign in failed'
    }

    setUserEmail(email)
    return null
  }, [])

  const signUp = useCallback(async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<string | null> => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    })

    if (!res.ok) {
      const data = await res.json()
      return data.error ?? 'Sign up failed'
    }

    setUserEmail(email)
    setUserEmailCookie(email)
    return null
  }, [])

  const signOut = useCallback(() => {
    setUserEmail(null)
    setUserEmailCookie(null)
  }, [])

  return (
    <AuthContext.Provider value={{ userEmail, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
