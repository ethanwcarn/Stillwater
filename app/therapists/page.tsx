import { Suspense } from 'react'
import { query } from '@/lib/db'
import { faithTraditions } from '@/lib/faith-traditions'
import Link from 'next/link'
import { TherapistFaithFilter } from '@/app/therapists/therapist-faith-filter'

export const dynamic = 'force-dynamic'

type Therapist = {
  id: number
  name: string
  credentials: string | null
  bio: string | null
  faith_tradition: string | null
}

const faithList = faithTraditions as readonly string[]

function resolveFaithFilter(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined
  const v = Array.isArray(value) ? value[0] : value
  const t = v?.trim()
  if (!t) return undefined
  return faithList.includes(t) ? t : undefined
}

async function getTherapists(faith?: string): Promise<Therapist[]> {
  try {
    if (faith) {
      const result = await query<Therapist>(
        `
        SELECT id, name, credentials, bio, faith_tradition
        FROM therapists
        WHERE faith_tradition = $1
        ORDER BY name
      `,
        [faith]
      )
      return result.rows
    }
    const result = await query<Therapist>(`
      SELECT id, name, credentials, bio, faith_tradition
      FROM therapists
      ORDER BY name
    `)
    return result.rows
  } catch {
    return []
  }
}

type TherapistsPageProps = {
  searchParams: Promise<{ faith?: string | string[] }>
}

function FaithFilterFallback() {
  return (
    <div className="flex flex-col gap-1.5 sm:max-w-xs">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  )
}

export default async function TherapistsPage({ searchParams }: TherapistsPageProps) {
  const params = await searchParams
  const faithFilter = resolveFaithFilter(params.faith)
  const therapists = await getTherapists(faithFilter)

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-secondary/8 via-primary/8 to-transparent px-4 pb-8 pt-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-foreground">Faith-Informed Therapists</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse therapists who integrate faith with mental health support.
              </p>
            </div>
            <Link
              href="/request-session"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Request a Session
            </Link>
          </div>

          <p className="mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-foreground">
            Therapists listed here are independent contractors and are not employees of Stillwaters.
            Booking details and final confirmation come directly from the therapist or their office.
          </p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Suspense fallback={<FaithFilterFallback />}>
            <TherapistFaithFilter />
          </Suspense>
        </div>

        {therapists.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-muted-foreground">
            {faithFilter ? (
              <p>
                No therapists for this tradition yet.{' '}
                <Link href="/therapists" className="font-medium text-primary underline-offset-4 hover:underline">
                  Show all therapists
                </Link>
              </p>
            ) : (
              'No therapists are available yet.'
            )}
          </div>
        ) : (
          <section
            aria-label="Therapist directory"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {therapists.map((therapist) => (
              <article
                key={therapist.id}
                className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {therapist.name}
                </h2>

                {therapist.credentials && (
                  <p className="mt-1 text-sm font-medium text-primary">
                    {therapist.credentials}
                  </p>
                )}

                {therapist.faith_tradition && (
                  <span className="mt-3 inline-block rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
                    {therapist.faith_tradition}
                  </span>
                )}

                {therapist.bio && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {therapist.bio}
                  </p>
                )}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
