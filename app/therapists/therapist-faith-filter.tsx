'use client'

import type { ChangeEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { faithTraditions } from '@/lib/faith-traditions'

export function TherapistFaithFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const raw = searchParams.get('faith') ?? ''
  const list = faithTraditions as readonly string[]
  const value = list.includes(raw) ? raw : ''

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (next) params.set('faith', next)
    else params.delete('faith')
    const q = params.toString()
    router.push(q ? `${pathname}?${q}` : pathname)
  }

  return (
    <div className="flex flex-col gap-1.5 sm:max-w-xs">
      <label htmlFor="therapist-faith-filter" className="text-sm font-medium text-foreground">
        Faith tradition
      </label>
      <select
        id="therapist-faith-filter"
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">All traditions</option>
        {faithTraditions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}
