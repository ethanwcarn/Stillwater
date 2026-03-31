'use client'

import { useState } from 'react'
import { BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

type BookmarkedPost = {
  id: number
  title: string | null
  content: string
  created_at: string
  author_name: string | null
}

type BookmarkedPostsListProps = {
  initialPosts: BookmarkedPost[]
}

export function BookmarkedPostsList({ initialPosts }: BookmarkedPostsListProps) {
  const [posts, setPosts] = useState<BookmarkedPost[]>(initialPosts)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const handleRemoveBookmark = async (postId: number) => {
    if (pendingIds.has(postId)) return

    setError(null)
    setPendingIds((prev) => new Set(prev).add(postId))

    const previousPosts = posts
    setPosts((prev) => prev.filter((post) => post.id !== postId))

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to remove bookmark')
      }

      const data = await res.json().catch(() => ({}))
      if (data.bookmarked !== false) {
        throw new Error('Unexpected bookmark state')
      }
    } catch (err) {
      setPosts(previousPosts)
      setError(
        err instanceof Error ? err.message : 'Failed to remove bookmark'
      )
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }

  if (posts.length === 0) {
    return (
      <p className="mt-6 rounded-2xl border bg-card p-8 text-center text-muted-foreground">
        No posts bookmarked.
      </p>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {posts.map((post) => (
        <article key={post.id} className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {post.title && (
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {post.title}
                </h2>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                {post.author_name && (
                  <span className="font-medium text-foreground">
                    {post.author_name}
                  </span>
                )}
                {post.author_name && ' · '}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {post.content}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveBookmark(post.id)}
              disabled={pendingIds.has(post.id)}
              className={cn(
                'inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium transition',
                'border-primary/30 text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60'
              )}
            >
              <BookmarkCheck className="mr-1.5 h-4 w-4" />
              {pendingIds.has(post.id) ? 'Removing...' : 'Remove bookmark'}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
