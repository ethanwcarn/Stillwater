'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type AuthContextType = {
  userEmail: string | null
  signIn: (email: string, _password: string) => void
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

  const signIn = useCallback((email: string, _password: string) => {
    setUserEmail(email)
    setUserEmailCookie(email)
  }, [])

  const signOut = useCallback(() => {
    setUserEmail(null)
    setUserEmailCookie(null)
  }, [])

  return (
    <AuthContext.Provider value={{ userEmail, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
