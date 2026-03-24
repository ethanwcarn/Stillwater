'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/app/providers'

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInPageSkeleton />}>
      <SignInPageContent />
    </Suspense>
  )
}

function SignInPageContent() {
  const { signIn, userEmail } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const passwordResetSuccess = searchParams.get('passwordReset') === 'success'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (userEmail) {
      router.replace('/')
    }
  }, [router, userEmail])

  if (userEmail) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Please enter a valid email'
    if (!password.trim()) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setSubmitting(true)
    const err = await signIn(email, password)
    setSubmitting(false)
    if (err) {
      setServerError(err)
    } else {
      router.push('/')
    }
  }

  const forgotPasswordHref = email.trim()
    ? `/reset-password?email=${encodeURIComponent(email.trim())}`
    : '/reset-password'

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-secondary/5 via-primary/5 to-background">
      <div className="flex items-center justify-center px-4 pb-12 pt-12 md:pt-20">
        <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/95 p-6 shadow-lg backdrop-blur md:p-8">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-semibold text-foreground">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {passwordResetSuccess && (
              <p className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
                Your password has been updated. Sign in with your new password.
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.email ? 'border-destructive' : 'border-input'}`}
              />
              {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                <Link href={forgotPasswordHref} className="text-xs font-medium text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.password ? 'border-destructive' : 'border-input'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-destructive">{errors.password}</span>}
            </div>

            {serverError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/signup" className="font-medium text-accent hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SignInPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-primary/5 to-background">
      <div className="flex items-center justify-center px-4 pb-12 pt-12 md:pt-20">
        <div className="h-[34rem] w-full max-w-md rounded-2xl border border-border/50 bg-card/95 shadow-lg backdrop-blur" />
      </div>
    </div>
  )
}
