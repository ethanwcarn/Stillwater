'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ChevronDown, Check } from 'lucide-react'
import { useAuth } from '@/app/providers'

const faithTraditions = [
  'Christianity',
  'Islam',
  'Judaism',
  'Buddhism',
  'Hinduism',
  'Sikhism',
  'Interfaith',
  'Secular / No preference',
  'Other',
]

export default function SignUpPage() {
  const { signUp, userEmail } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    faithTradition: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (userEmail) {
    router.replace('/')
    return null
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Please enter a valid email'
    if (!form.faithTradition) newErrors.faithTradition = 'Please select your faith tradition'
    if (!form.password.trim()) newErrors.password = 'Password is required'
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setSubmitting(true)
    const displayName = `${form.firstName.trim()} ${form.lastName.trim()}`
    const err = await signUp(form.email, form.password, displayName)
    setSubmitting(false)
    if (err) {
      setServerError(err)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/'), 1500)
    }
  }

  if (success) {
    return (
      <div className="animate-fade-in flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-background px-4">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">
            Welcome to Stillwaters
          </h2>
          <p className="mt-2 text-muted-foreground">
            Your account has been created. Redirecting you now…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
      <div className="flex items-center justify-center px-4 pb-12 pt-8">
        <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-lg md:p-8">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-semibold text-foreground">Create Your Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Begin your faith-integrated healing journey</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                <input
                  id="firstName"
                  placeholder="Sarah"
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.firstName ? 'border-destructive' : 'border-input'}`}
                />
                {errors.firstName && <span className="text-xs text-destructive">{errors.firstName}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                <input
                  id="lastName"
                  placeholder="Mitchell"
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.lastName ? 'border-destructive' : 'border-input'}`}
                />
                {errors.lastName && <span className="text-xs text-destructive">{errors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.email ? 'border-destructive' : 'border-input'}`}
              />
              {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
            </div>

            {/* Faith Tradition dropdown */}
            <div className="relative flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Faith Tradition</label>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm transition-colors ${errors.faithTradition ? 'border-destructive' : 'border-input'} ${form.faithTradition ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {form.faithTradition || 'Select your faith tradition'}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showDropdown && (
                <div className="absolute top-full z-50 mt-1 w-full rounded-lg border border-border bg-card py-1 shadow-lg">
                  {faithTraditions.map((tradition) => (
                    <button
                      key={tradition}
                      type="button"
                      onClick={() => {
                        setForm((p) => ({ ...p, faithTradition: tradition }))
                        setShowDropdown(false)
                      }}
                      className="flex w-full items-center px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      {tradition}
                    </button>
                  ))}
                </div>
              )}
              {errors.faithTradition && <span className="text-xs text-destructive">{errors.faithTradition}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
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
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-accent hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
