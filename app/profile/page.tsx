import Link from 'next/link'
import { cookies } from 'next/headers'
import { Bell, Bookmark, Lock, LogOut, Mail, Phone, User } from 'lucide-react'
import { getSessionUserFromCookieStore } from '@/lib/session'
import { query } from '@/lib/db'

type ProfileUser = {
  id: number
  email: string
  display_name: string | null
  faith_tradition: string | null
  created_at: string
}

async function getProfileUser(userId: number): Promise<ProfileUser | null> {
  const result = await query<ProfileUser>(
    `
      SELECT id, email, display_name, faith_tradition, created_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  )

  return result.rows[0] ?? null
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionUser = await getSessionUserFromCookieStore(cookieStore)

  if (!sessionUser) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Profile
        </h1>

        <div className="mt-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            You need to sign in before you can view your profile.
          </p>

          <Link
            href="/signin"
            className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    )
  }

  const user = await getProfileUser(sessionUser.id)

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Profile
        </h1>

        <div className="mt-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            We could not find your profile information.
          </p>
        </div>
      </main>
    )
  }

  const initials =
    user.display_name
      ?.split(' ')
      .map((name) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || user.email.slice(0, 2).toUpperCase()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Profile
      </h1>

      {/* Top profile card */}
      <section className="mt-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-semibold text-primary-foreground">
            {initials}
          </div>

          <div className="min-w-0">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {user.display_name || 'User'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user.faith_tradition || 'Not provided'}
            </p>
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

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm text-foreground">(555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Faith Tradition</p>
              <p className="text-sm text-foreground">
                {user.faith_tradition || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Saved posts */}
      <section className="mt-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Saved Posts</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the community posts you have bookmarked.
        </p>
        <Link
          href="/profile/bookmarks"
          className="mt-4 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Bookmark className="mr-2 h-4 w-4" />
          View Bookmarked Posts
        </Link>
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