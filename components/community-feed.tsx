'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/app/providers'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Post {
  id: number
  author_id: number | null
  title: string | null
  content: string
  created_at: string
  author_name: string | null
  bookmarked: boolean
}

export function CommunityFeed() {
  const { userEmail, authReady } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error('Failed to fetch posts')
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    // Refetch when user signs in/out to update bookmarked status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userEmail) {
      setSubmitError('Please sign in to create a post.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          title,
          content,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post')
      }

      setTitle('')
      setContent('')
      await fetchPosts()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to create post'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBookmark = async (postId: number, currentBookmarked: boolean) => {
    if (!authReady) return

    if (!userEmail) {
      alert('Please sign in to bookmark posts.')
      return
    }

    const optimisticValue = !currentBookmarked
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, bookmarked: optimisticValue } : p
      )
    )

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to toggle bookmark')
      }
      const { bookmarked } = await res.json()
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, bookmarked } : p))
      )
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, bookmarked: currentBookmarked } : p
        )
      )
      alert(err instanceof Error ? err.message : 'Failed to update bookmark')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border bg-card p-6"
          >
            <div className="mb-2 h-4 w-1/3 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Ensure PostgreSQL is running and you&apos;ve run db/schema.sql and
          db/seed.sql.
        </p>
        <button
          onClick={fetchPosts}
          className="mt-3 text-sm underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Create a post</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share encouragement, questions, or practical advice with the community.
          </p>
        </div>

        {userEmail ? (
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div>
              <label
                htmlFor="post-title"
                className="block text-sm text-muted-foreground"
              >
                Title <span className="text-xs">(optional)</span>
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={255}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Give your post a short title"
              />
            </div>

            <div>
              <label
                htmlFor="post-content"
                className="block text-sm text-muted-foreground"
              >
                Your post
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="What would you like to share?"
                required
              />
            </div>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting…' : 'Post to community'}
            </button>
          </form>
        ) : (
          <p className="rounded-2xl border border-secondary/30 bg-secondary/10 p-3 text-sm text-accent">
            Sign in to create a community post.
          </p>
        )}
      </section>

      {authReady && !userEmail && (
        <p className="rounded-2xl border border-secondary/30 bg-secondary/10 p-3 text-sm text-accent">
          Sign in to bookmark posts and save your favorites.
        </p>
      )}
      {posts.length === 0 ? (
        <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
          No posts yet.
        </p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {post.title && (
                  <h3 className="mb-1 font-serif font-semibold text-foreground">
                    {post.title}
                  </h3>
                )}
                <p className="text-muted-foreground">
                  {post.author_name && (
                    <span className="font-medium text-foreground">
                      {post.author_name}
                    </span>
                  )}
                  {post.author_name && ' · '}
                  <span className="text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {post.content}
                </p>
              </div>
              <button
                onClick={() => handleBookmark(post.id, post.bookmarked)}
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full p-2 transition',
                  post.bookmarked
                    ? 'text-primary hover:bg-primary/10'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-label={post.bookmarked ? 'Remove bookmark' : 'Bookmark post'}
                title={post.bookmarked ? 'Remove bookmark' : 'Bookmark post'}
              >
                {post.bookmarked ? (
                  <BookmarkCheck size={22} />
                ) : (
                  <Bookmark size={22} />
                )}
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  )
}
