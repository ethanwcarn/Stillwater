'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { featuredTherapists } from '@/lib/therapists'

export function TherapistCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const card = scrollRef.current.children[0] as HTMLElement
    const amount = card ? card.offsetWidth + 20 : 340
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Left button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute -left-12 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card shadow-md transition-colors hover:bg-muted"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {featuredTherapists.map((therapist) => (
          <Link
            key={therapist.id}
            href="/therapists"
            className="group w-[calc((100%-2.5rem)/3)] flex-none overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden bg-muted md:h-72">
              <img
                src={therapist.photo_url}
                alt={therapist.name}
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                {therapist.faith_tradition}
              </span>
            </div>
            {/* Info */}
            <div className="p-5">
              <p className="font-serif text-base font-semibold leading-snug text-foreground">
                {therapist.name}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {therapist.bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {therapist.specialties.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-secondary/20 px-3 py-1 text-xs text-accent"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute -right-12 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card shadow-md transition-colors hover:bg-muted"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>
    </div>
  )
}
