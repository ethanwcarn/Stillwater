import Link from 'next/link'
import { query } from '@/lib/db'
import { SessionRequestForm } from '@/components/session-request-form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSessionUserFromCookieStore } from '@/lib/session'

export const dynamic = 'force-dynamic'

type TherapistOption = {
  id: number
  name: string
  credentials: string | null
  photo_url: string | null
}

async function getTherapists(): Promise<TherapistOption[]> {
  try {
    const result = await query<TherapistOption>(`
      SELECT id, name, credentials, photo_url
      FROM therapists
      ORDER BY name
    `)
    return result.rows
  } catch {
    return []
  }
}

type RequestSessionPageProps = {
  searchParams: Promise<{ therapistId?: string }>
}

export default async function RequestSessionPage({ searchParams }: RequestSessionPageProps) {
  const cookieStore = await cookies()
  const currentUser = await getSessionUserFromCookieStore(cookieStore)
  if (!currentUser) {
    redirect('/signin')
  }

  const { therapistId } = await searchParams
  const defaultTherapistId = therapistId ? Number(therapistId) : undefined

  const therapists = await getTherapists()

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary/8 via-secondary/8 to-transparent px-4 pb-8 pt-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Request a Session</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your provider, preferred date, and a time slot.
          </p>
          <Link href="/therapists" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Back to therapists
          </Link>
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        {therapists.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-muted-foreground">
            No providers are available to request right now.
          </div>
        ) : (
          <SessionRequestForm therapists={therapists} defaultTherapistId={defaultTherapistId} />
        )}
      </main>
    </div>
  )
}
