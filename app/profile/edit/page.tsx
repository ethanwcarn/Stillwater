'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Lock, LogOut, Mail, Phone, User, Calendar, Check, X, ArrowLeft } from 'lucide-react'

type ProfileUser = {
  id: number
  email: string
  display_name: string | null
  faith_tradition: string | null
  created_at: string
}

type Appointment = {
  id: number
  title: string
  date: string
  time: string
  description: string | null
}

export default function EditProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [displayName, setDisplayName] = useState('')
  const [faithTradition, setFaithTradition] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, appointmentsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/appointments/future')
        ])

        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData)
          setDisplayName(userData.display_name || '')
          setFaithTradition(userData.faith_tradition || '')
        } else {
          router.push('/signin')
        }

        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json()
          setAppointments(appointmentsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName, faith_tradition: faithTradition }),
      })

      if (response.ok) {
        router.push('/profile')
      } else {
        alert('Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <div className="mt-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <div className="mt-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">You need to sign in.</p>
          <Link href="/signin" className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Go to sign in
          </Link>
        </div>
      </main>
    )
  }

  const initials =
    displayName
      ?.split(' ')
      .map((name) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || user.email.slice(0, 2).toUpperCase()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted hover:bg-muted/80">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Edit Profile
        </h1>
      </div>

      {/* Editable profile card */}
      <section className="mt-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-semibold text-primary-foreground">
              {initials}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
              <input
                type="text"
                value={faithTradition}
                onChange={(e) => setFaithTradition(e.target.value)}
                placeholder="Faith tradition"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <Link href="/profile" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted hover:bg-muted/80">
              <X className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact information */}
      <section className="mt-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">
          Contact Information
        </h3>

        <div className="mt-5 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="break-words text-sm text-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming appointments */}
      {appointments.length > 0 && (
        <section className="mt-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold text-foreground">
            Upcoming Appointments
          </h3>

          <div className="mt-5 flex flex-col gap-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start gap-3 border-b border-border pb-4 last:border-b-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{appointment.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </p>
                  {appointment.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{appointment.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Settings */}
      <section className="mt-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Settings</h3>

        <div className="mt-4 flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Push &amp; email notifications
              </p>
            </div>
          </div>

          <div className="flex h-7 w-12 items-center rounded-full bg-primary px-1">
            <div className="ml-auto h-5 w-5 rounded-full bg-white" />
          </div>
        </div>

        <div className="my-2 h-px bg-border" />

        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Privacy</p>
              <p className="text-xs text-muted-foreground">
                Profile visibility settings
              </p>
            </div>
          </div>

          <div className="flex h-7 w-12 items-center rounded-full bg-muted px-1">
            <div className="h-5 w-5 rounded-full bg-white" />
          </div>
        </div>
      </section>

      {/* Log out */}
      <form action="/api/auth/signout" method="POST" className="mt-6">
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl border border-destructive/30 bg-transparent px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/5"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </button>
      </form>
    </main>
  )
}