'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { faithTraditions } from '@/lib/faith-traditions'

export function TherapistFaithFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const rawFaith = searchParams.get('faith') ?? ''
  const rawQuery = searchParams.get('query') ?? ''
  const list = faithTraditions as readonly string[]
  const faithValue = list.includes(rawFaith) ? rawFaith : ''
  const [queryValue, setQueryValue] = useState(rawQuery)

  useEffect(() => {
    setQueryValue(rawQuery)
  }, [rawQuery])

  const pushParams = (nextFaith: string, nextQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (nextFaith) params.set('faith', nextFaith)
    else params.delete('faith')

    const trimmedQuery = nextQuery.trim()
    if (trimmedQuery) params.set('query', trimmedQuery)
    else params.delete('query')

    const q = params.toString()
    router.push(q ? `${pathname}?${q}` : pathname)
  }

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    pushParams(e.target.value, queryValue)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    pushParams(faithValue, queryValue)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_auto] sm:items-end">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="therapist-query" className="text-sm font-medium text-foreground">
          Search by name or keyword
        </label>
        <input
          id="therapist-query"
          type="search"
          value={queryValue}
          onChange={(event) => setQueryValue(event.target.value)}
          placeholder="Try anxiety, grief, Rachel..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="therapist-faith-filter" className="text-sm font-medium text-foreground">
          Faith tradition
        </label>
        <select
          id="therapist-faith-filter"
          value={faithValue}
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

      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </form>
  )
}
