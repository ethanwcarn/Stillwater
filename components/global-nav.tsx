'use client'

import Link from 'next/link'
import { Home, MessageCircle, Heart, LogOut } from 'lucide-react'
import { useAuth } from '@/app/providers'

export function GlobalNav() {
  const { userEmail, signOut } = useAuth()

  return (
    <header className="border-b bg-card">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold text-primary">
          Stillwaters
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link href="/community" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
            <MessageCircle size={18} />
            <span className="hidden sm:inline">Community</span>
          </Link>
          
          {/* Rank 13 Implementation */}
          {userEmail ? (
            <div className="flex items-center gap-4 border-l pl-6">
              <span className="text-xs text-muted-foreground hidden md:inline">
                {userEmail}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-destructive hover:opacity-80 transition-opacity text-sm font-medium"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link href="/" className="text-sm font-medium text-primary hover:underline">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}