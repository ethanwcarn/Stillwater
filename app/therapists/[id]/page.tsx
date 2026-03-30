import Link from 'next/link'
import { notFound } from 'next/navigation'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

type Therapist = {
  id: number
  name: string
  credentials: string | null
  bio: string | null
  faith_tradition: string | null
  photo_url: string | null
}

type TherapistSpecialty = {
  specialty: string
}

async function getTherapist(id: number): Promise<Therapist | null> {
  const result = await query<Therapist>(
    `
    SELECT id, name, credentials, bio, faith_tradition, photo_url
    FROM therapists
    WHERE id = $1
    `,
    [id]
  )
  return result.rows[0] ?? null
}

async function getSpecialties(id: number): Promise<string[]> {
  const result = await query<TherapistSpecialty>(
    `
    SELECT specialty
    FROM therapist_specialties
    WHERE therapist_id = $1
    ORDER BY specialty
    `,
    [id]
  )
  return result.rows.map((row) => row.specialty)
}

type TherapistDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function TherapistDetailPage({ params }: TherapistDetailPageProps) {
  const { id } = await params
  const therapistId = Number(id)

  if (!Number.isInteger(therapistId)) {
    notFound()
  }

  const therapist = await getTherapist(therapistId)
  if (!therapist) {
    notFound()
  }

  const specialties = await getSpecialties(therapistId)

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-secondary/8 via-primary/8 to-transparent px-4 pb-8 pt-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/therapists" className="text-sm font-medium text-primary hover:underline">
            Back to therapists
          </Link>
          <div className="mt-3 flex items-center gap-4">
            {therapist.photo_url && (
              <img
                src={therapist.photo_url}
                alt={therapist.name}
                className="h-20 w-20 flex-none rounded-full object-cover object-top shadow-md md:h-24 md:w-24"
              />
            )}
            <div>
              <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">{therapist.name}</h1>
              {therapist.credentials && (
                <p className="mt-1 text-base font-medium text-primary">{therapist.credentials}</p>
              )}
              {therapist.faith_tradition && (
                <span className="mt-3 inline-block rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
                  {therapist.faith_tradition}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6">
          {therapist.bio && (
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                About
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{therapist.bio}</p>
            </section>
          )}

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Modality
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Modality details coming soon.
            </p>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Faith Integration
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Faith integration details coming soon.
            </p>
          </section>

          {specialties.length > 0 && (
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Specialties
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Request a session and we will connect you with this therapist.
            </p>
            <Link
              href={`/request-session?therapistId=${therapist.id}`}
              className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Request a Session
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
