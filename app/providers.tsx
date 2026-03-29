'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

type AuthContextType = {
  userEmail: string | null
  authReady: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string, displayName?: string) => Promise<string | null>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

  const loadSessionUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (!res.ok) {
        setUserEmail(null)
        return
      }

      const data = await res.json()
      setUserEmail(typeof data?.email === 'string' ? data.email : null)
    } catch {
      setUserEmail(null)
    } finally {
      setAuthReady(true)
    }
  }, [])

  useEffect(() => {
    void loadSessionUser()
  }, [loadSessionUser])

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

    const data = await res.json()
    setUserEmail(typeof data?.email === 'string' ? data.email : email)
    setAuthReady(true)
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

    const data = await res.json()
    setUserEmail(typeof data?.email === 'string' ? data.email : email)
    setAuthReady(true)
    return null
  }, [])

  const signOut = useCallback(() => {
    setUserEmail(null)
    setAuthReady(true)
    void fetch('/api/auth/signout', { method: 'POST' })
  }, [])

  return (
    <AuthContext.Provider value={{ userEmail, authReady, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
