import Link from 'next/link'
import { Home, MessageCircle, Heart } from 'lucide-react'
import { SignInForm } from '@/components/sign-in-form'

type HomePageProps = {
  searchParams: Promise<{
    auth?: string | string[]
    passwordReset?: string | string[]
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const authParam = Array.isArray(params.auth) ? params.auth[0] : params.auth
  const passwordResetParam = Array.isArray(params.passwordReset)
    ? params.passwordReset[0]
    : params.passwordReset
  const initialAuthMode = authParam === 'signup' ? 'signup' : 'signin'
  const passwordResetSuccess = passwordResetParam === 'success'
  const initiallyOpen =
    authParam === 'signin' || authParam === 'signup' || passwordResetSuccess

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold text-primary">Stillwaters</h1>
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
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Heart size={18} />
              <span>Therapists</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Faith-Integrated Mental Health
          </h2>
          <p className="text-muted-foreground">
            Connect with faith-aware support, community, and resources.
          </p>
        </section>

        <SignInForm
          initialAuthMode={initialAuthMode}
          initiallyOpen={initiallyOpen}
          passwordResetSuccess={passwordResetSuccess}
        />

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/community"
            className="rounded-lg border bg-card p-6 transition hover:border-primary"
          >
            <MessageCircle className="mb-2 text-primary" size={32} />
            <h3 className="font-semibold">Community</h3>
            <p className="text-sm text-muted-foreground">
              Join the supportive feed. Save posts with the bookmark button.
            </p>
          </Link>
          <Link
            href="/therapists"
            className="rounded-lg border bg-card p-6 transition hover:border-primary"
          >
            <Heart className="mb-2 text-primary" size={32} />
            <h3 className="font-semibold">Find Therapists</h3>
            <p className="text-sm text-muted-foreground">
              Browse faith-informed therapists near you.
            </p>
          </Link>
        </section>
      </main>
    </div>
  )
}
