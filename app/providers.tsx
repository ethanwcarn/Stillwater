'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type AuthContextType = {
  userEmail: string | null
  signIn: (email: string, _password: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const signIn = useCallback((email: string, _password: string) => {
    setUserEmail(email)
  }, [])

  const signOut = useCallback(() => {
    setUserEmail(null)
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
