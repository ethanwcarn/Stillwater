"use client";

import Link from "next/link";
import { Search, CalendarPlus, Users } from "lucide-react";
import { TherapistCarousel } from "@/components/therapist-carousel";
import { useAuth } from "./providers";

export default function HomePage() {
  const { userEmail, authReady } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/15 to-muted px-4 py-20 text-center md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--secondary)/0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            <span className="text-balance">Faith, without fear.</span>
          </h1>
          <p className="mt-4 font-serif text-2xl text-accent md:text-3xl">
            <span className="text-balance">Support, without judgment.</span>
          </p>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            A safe space where your mental health and spiritual life work
            together. Connect with faith-informed therapists and a caring
            community.
          </p>
          {authReady && !userEmail && (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                Create an Account
              </Link>
              <Link
                href="/signin"
                className="w-full rounded-full border border-primary/30 bg-white/80 px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white sm:w-auto"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            <span className="text-balance">How Stillwaters Works</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
            Three simple steps to begin your healing journey
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Find Your Therapist",
                desc: "Browse faith-informed therapists filtered by tradition, specialty, and availability.",
                href: "/therapists",
              },
              {
                icon: CalendarPlus,
                title: "Request a Session",
                desc: "Choose your preferred date, time, and discussion topics that matter to you.",
                href: "/request-session",
              },
              {
                icon: Users,
                title: "Join the Community",
                desc: "Connect with others who share your journey in faith-centered discussion groups.",
                href: "/community",
              },
            ].map((step) => (
              <Link
                key={step.title}
                href={step.href}
                className="group rounded-2xl border border-border/50 bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/20 text-accent transition-colors duration-300 group-hover:bg-secondary/30">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Therapists */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                Featured Therapists
              </h2>
              <p className="mt-2 text-muted-foreground">
                Faith-informed professionals ready to walk with you
              </p>
            </div>
            <Link
              href="/therapists"
              className="hidden text-sm font-medium text-accent hover:underline md:block"
            >
              View all
            </Link>
          </div>
        </div>
        {/* Carousel sits outside px-4 on mobile so cards can peek at the right edge */}
        <div className="mt-8 px-4 md:mx-auto md:max-w-5xl">
          <TherapistCarousel />
        </div>
        <div className="mt-4 px-4 text-center md:hidden">
          <Link
            href="/therapists"
            className="text-sm font-medium text-accent hover:underline"
          >
            View all therapists
          </Link>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                Community Highlights
              </h2>
              <p className="mt-2 text-muted-foreground">
                See what others are sharing in the Stillwaters community
              </p>
            </div>
            <Link
              href="/community"
              className="hidden text-sm font-medium text-accent hover:underline md:block"
            >
              See all
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                category: "Prayer",
                title: "Finding peace through prayer during anxiety",
                author: "Sarah M.",
              },
              {
                category: "Scripture",
                title: "Scriptures that helped me through depression",
                author: "Jordan K.",
              },
              {
                category: "Interfaith",
                title: "How my faith tradition views mental health",
                author: "Ana R.",
              },
            ].map((post) => (
              <Link
                key={post.title}
                href="/community"
                className="rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:shadow-md"
              >
                <span className="inline-block rounded-full bg-secondary/20 px-3 py-0.5 text-xs font-medium text-accent">
                  {post.category}
                </span>
                <h3 className="mt-3 font-serif text-base font-semibold text-foreground">
                  {post.title}
                </h3>
                <p className="mt-3 text-xs text-muted-foreground">
                  {post.author}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-gradient-to-br from-secondary/10 via-muted to-primary/5 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            <span className="text-balance">Begin your journey today</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Join a growing community of people who believe mental health and
            faith belong together.
          </p>
          {authReady && !userEmail && (
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-full bg-primary px-10 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create an Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <p className="font-serif text-base font-semibold text-foreground">
                Stillwaters
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Faith-integrated mental health support for every journey.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Find Therapists", "Community"] },
              { title: "Company", links: ["About Us", "Blog"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-foreground">
                  {col.title}
                </h4>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-muted-foreground">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            2026{" "}
            <a href="https://grafana.dojo.aechay.com/public-dashboards/6b1696c01e024a8c9038424fdacded37">
              Stillwaters.
            </a>{" "}
            All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
