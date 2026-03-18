import Link from 'next/link'
import { Home, MessageCircle, Heart } from 'lucide-react'
import { query } from '@/lib/db'

// This tells TypeScript what one therapist row looks like
type Therapist = {
  id: number
  name: string
  credentials: string | null
  bio: string | null
  faith_tradition: string | null
}

// Get therapist data from PostgreSQL
async function getTherapists(): Promise<Therapist[]> {
  const result = await query<Therapist>(`
    SELECT id, name, credentials, bio, faith_tradition
    FROM therapists
    ORDER BY name
  `)

  return result.rows
}

export default async function TherapistsPage() {
  // Pull the real therapist data from the database
  const therapists = await getTherapists()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <nav className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-xl font-semibold text-primary">
            Stillwaters
          </Link>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:text-base"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/community"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:text-base"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Community</span>
            </Link>

            <Link
              href="/therapists"
              className="flex items-center gap-2 text-sm font-medium text-foreground sm:text-base"
            >
              <Heart size={18} />
              <span className="hidden sm:inline">Therapists</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-4 text-2xl font-semibold text-foreground sm:mb-6">
          Faith-Informed Therapists
        </h1>

        <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">
          Browse therapists who integrate faith with mental health support.
        </p>

        {/* If no therapists exist in the database, show a friendly fallback */}
        {therapists.length === 0 ? (
          <div className="rounded-lg border bg-card p-4 text-muted-foreground sm:p-6">
            <p>No therapists are available yet.</p>
          </div>
        ) : (
          // Responsive grid: 1 column on mobile, 2 on medium+ screens
          <section
            aria-label="Therapist directory"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {therapists.map((therapist) => (
              <article
                key={therapist.id}
                className="rounded-lg border bg-card p-4 shadow-sm sm:p-6"
              >
                <h2 className="text-xl font-semibold text-foreground">
                  {therapist.name}
                </h2>

                {/* Credentials only show if they exist */}
                {therapist.credentials && (
                  <p className="mt-1 text-sm font-medium text-primary">
                    {therapist.credentials}
                  </p>
                )}

                {/* Faith tradition badge/label */}
                {therapist.faith_tradition && (
                  <p className="mt-3 inline-block rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                    {therapist.faith_tradition}
                  </p>
                )}

                {/* Bio text */}
                {therapist.bio && (
                  <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
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