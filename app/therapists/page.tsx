import Link from 'next/link'
import { Home, MessageCircle, Heart } from 'lucide-react'

export default function TherapistsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold text-primary">
            Stillwaters
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/community"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <MessageCircle size={18} />
              <span>Community</span>
            </Link>
            <Link
              href="/therapists"
              className="flex items-center gap-2 font-medium text-foreground"
            >
              <Heart size={18} />
              <span>Therapists</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">
          Faith-Informed Therapists
        </h2>
        <p className="mb-8 text-muted-foreground">
          Browse therapists who integrate faith with mental health support.
        </p>
        <div className="space-y-4 rounded-lg border bg-card p-6 text-muted-foreground">
          <p>
            Therapist directory coming soon. Run db/seed.sql to add sample
            therapists to your database.
          </p>
        </div>
      </main>
    </div>
  )
}
