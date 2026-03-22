import { CommunityFeed } from '@/components/community-feed'

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary/8 via-secondary/8 to-transparent px-4 pb-8 pt-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Community</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A faith-centered space to share, listen, and find encouragement.
          </p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <CommunityFeed />
      </main>
    </div>
  )
}
