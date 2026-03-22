import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

type Therapist = {
  id: number
  name: string
  credentials: string | null
  bio: string | null
  faith_tradition: string | null
}

async function getTherapists(): Promise<Therapist[]> {
  try {
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

export default async function TherapistsPage() {
  const therapists = await getTherapists()

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-secondary/8 via-primary/8 to-transparent px-4 pb-8 pt-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Faith-Informed Therapists</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse therapists who integrate faith with mental health support.
          </p>
        </div>
      </div>
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">

      {therapists.length === 0 ? (
        <div className="rounded-2xl border bg-card p-6 text-muted-foreground">
          No therapists are available yet.
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
