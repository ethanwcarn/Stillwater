'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type AuthContextType = {
  userEmail: string | null
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string, displayName?: string) => Promise<string | null>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)

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
    return null
  }, [])

  const signOut = useCallback(() => {
    setUserEmail(null)
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
