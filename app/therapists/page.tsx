import Link from "next/link";
import { Home, MessageCircle, Heart } from "lucide-react";

export default function TherapistsPage() {
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
        <h2 className="mb-4 text-2xl font-semibold text-foreground sm:mb-6">
          Faith-Informed Therapists
        </h2>

        <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">
          Browse therapists who integrate faith with mental health support.
        </p>

        <div className="space-y-4 rounded-lg border bg-card p-4 text-muted-foreground sm:p-6">
          <p>
            Therapist directory coming soon. Run db/seed.sql to add sample
            therapists to your database.
          </p>
        </div>
      </main>
    </div>
  );
}
