'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { useAuth } from '@/app/providers'
import { cn } from '@/lib/utils'

type TherapistOption = {
  id: number
  name: string
  credentials: string | null
  photo_url: string | null
}

type SessionRequestFormProps = {
  therapists: TherapistOption[]
  defaultTherapistId?: number
}

type TimeOption = {
  value: string
  label: string
}

function buildTimeOptions(): TimeOption[] {
  const options: TimeOption[] = []

  for (let minutes = 8 * 60; minutes <= 18 * 60; minutes += 30) {
    const hour24 = Math.floor(minutes / 60)
    const minute = minutes % 60
    const value = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    const label = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(2000, 0, 1, hour24, minute))

    options.push({ value, label })
  }

  return options
}

const TIME_OPTIONS = buildTimeOptions()

function getTodayDate(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export function SessionRequestForm({ therapists, defaultTherapistId }: SessionRequestFormProps) {
  const { userEmail, authReady } = useAuth()
  const [providerId, setProviderId] = useState<string>(defaultTherapistId ? String(defaultTherapistId) : '')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const today = useMemo(() => getTodayDate(), [])
  const selectedProvider = therapists.find((therapist) => String(therapist.id) === providerId)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!authReady) {
      setError('Please wait a moment and try again.')
      return
    }

    if (!userEmail) {
      setError('Please sign in before requesting a session.')
      return
    }

    if (!providerId || !selectedDate || !selectedTime) {
      setError('Please choose a provider, date, and time.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/session-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistId: Number(providerId),
          sessionDate: format(selectedDate, 'yyyy-MM-dd'),
          sessionTime: selectedTime,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || 'Unable to submit your request.')
        return
      }

      const providerName = selectedProvider?.name || 'your selected provider'
      const readableDate = format(selectedDate, 'MMMM d, yyyy')
      const readableTime = TIME_OPTIONS.find((option) => option.value === selectedTime)?.label || selectedTime

      setSuccessMessage(
        `Request sent for ${providerName} on ${readableDate} at ${readableTime}. The provider's office will follow up with booking confirmation.`
      )
      setSelectedDate(undefined)
      setSelectedTime('')
    } catch {
      setError('Unable to submit your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {authReady && !userEmail && (
        <p className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-foreground">
          Please <Link href="/signin" className="font-medium underline">sign in</Link> to request a session.
        </p>
      )}

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <label htmlFor="provider" className="text-sm font-medium text-foreground">
          Select a Provider
        </label>
        <select
          id="provider"
          value={providerId}
          onChange={(event) => setProviderId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
          required
        >
          <option value="">Choose a therapist</option>
          {therapists.map((therapist) => (
            <option key={therapist.id} value={therapist.id}>
              {therapist.name}
              {therapist.credentials ? `, ${therapist.credentials}` : ''}
            </option>
          ))}
        </select>
        {selectedProvider?.photo_url && (
          <div className="mt-4 flex items-center gap-3">
            <img
              src={selectedProvider.photo_url}
              alt={selectedProvider.name}
              className="h-14 w-14 rounded-full object-cover object-top shadow-sm"
            />
            <p className="text-sm font-medium text-foreground">{selectedProvider.name}</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-foreground">Select a Date</p>
        <div className="mt-3 rounded-xl border border-border/70 bg-background/70 p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: today }}
            showOutsideDays
            className="mx-auto"
            classNames={{
              months: 'flex justify-center',
              month: 'space-y-3',
              caption: 'relative flex min-h-10 items-center justify-center px-12',
              caption_label: 'text-sm font-semibold text-foreground',
              nav: 'pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between',
              nav_button:
                'pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background text-foreground shadow-sm transition hover:bg-muted',
              nav_button_previous: 'ml-1',
              nav_button_next: 'mr-1',
              nav_icon: 'h-4 w-4',
              table: 'w-full border-collapse',
              head_row: 'flex',
              head_cell: 'w-9 text-xs font-medium text-muted-foreground',
              row: 'mt-2 flex w-full',
              cell: 'relative h-9 w-9 p-0 text-center text-sm',
              day: 'h-9 w-9 rounded-md text-sm text-foreground hover:bg-muted',
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary',
              day_today: 'border border-primary/70',
              day_outside: 'text-muted-foreground/50',
              day_disabled: 'text-muted-foreground/40 line-through',
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-foreground">Select a Time</p>
        <p className="mt-1 text-xs text-muted-foreground">30 minute increments from 8:00 AM to 6:00 PM</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedTime(option.value)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm transition',
                selectedTime === option.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background text-foreground hover:bg-muted'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-foreground">
        Therapists on Stillwaters are independent contractors and are not employees of Stillwaters.
        Session booking and final confirmation will come directly from the therapist or their office.
      </p>

      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || therapists.length === 0}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting Request...' : 'Submit Session Request'}
      </button>
    </form>
  )
}
