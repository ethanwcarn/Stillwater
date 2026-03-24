'use client'

import Link from 'next/link'
import { Droplets, Home, MessageCircle, Heart, LogOut } from 'lucide-react'
import { useAuth } from '@/app/providers'

export function GlobalNav() {
  const { userEmail, signOut, authReady } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Droplets className="h-4 w-4" />
          </div>
          <span className="font-serif text-lg font-semibold text-foreground">Stillwaters</span>
        </Link>

        {/* Nav links + auth */}
        <div className="flex items-center gap-5">
          <Link href="/" className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex">
            <Home size={16} />
            Home
          </Link>
          <Link href="/community" className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex">
            <MessageCircle size={16} />
            Community
          </Link>
          <Link href="/therapists" className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex">
            <Heart size={16} />
            Therapists
          </Link>

          {!authReady ? (
            <div className="h-8 w-24" />
          ) : userEmail ? (
            <div className="flex items-center gap-3 border-l border-border pl-5">
              <span className="hidden text-xs text-muted-foreground md:inline">{userEmail}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-sm font-medium text-destructive transition-opacity hover:opacity-70"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </nav>
    </header>
  )
}
