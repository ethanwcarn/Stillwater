'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/providers'
import { Bookmark, BookmarkCheck, MessageCircle, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Post {
  id: number
  author_id: number | null
  title: string | null
  content: string
  created_at: string
  author_name: string | null
  bookmarked: boolean
  comment_count: number
}

interface Comment {
  id: number
  post_id: number
  author_id: number | null
  content: string
  created_at: string
  author_name: string | null
}

export function CommunityFeed() {
  const { userEmail, authReady } = useAuth()
  const [userId, setUserId] = useState<number | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Comment state (per-post maps)
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set())
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({})
  const [commentLoadingMap, setCommentLoadingMap] = useState<Record<number, boolean>>({})
  const [commentInputMap, setCommentInputMap] = useState<Record<number, string>>({})
  const [commentSubmittingMap, setCommentSubmittingMap] = useState<Record<number, boolean>>({})

  // Edit post state
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [editPostTitle, setEditPostTitle] = useState('')
  const [editPostContent, setEditPostContent] = useState('')
  const [editPostSubmitting, setEditPostSubmitting] = useState(false)

  // Edit comment state
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [editCommentSubmitting, setEditCommentSubmitting] = useState(false)

  // Fetch current user ID so we can show/hide edit-delete buttons
  useEffect(() => {
    if (!userEmail) {
      setUserId(null)
      return
    }
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUserId(typeof data?.id === 'number' ? data.id : null))
      .catch(() => setUserId(null))
  }, [userEmail])

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

<<<<<<< Updated upstream
=======
  // ── Create post ──────────────────────────────────────────────────────────────

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
        body: JSON.stringify({ userEmail, title, content }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to create post')

      setTitle('')
      setContent('')
      await fetchPosts()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Bookmark ─────────────────────────────────────────────────────────────────

>>>>>>> Stashed changes
  const handleBookmark = async (postId: number, currentBookmarked: boolean) => {
    if (!authReady) return

    if (!userEmail) {
      alert('Please sign in to bookmark posts.')
      return
    }

    const optimisticValue = !currentBookmarked
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, bookmarked: optimisticValue } : p))
    )

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to toggle bookmark')
      }
      const { bookmarked } = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, bookmarked } : p)))
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, bookmarked: currentBookmarked } : p))
      )
      alert(err instanceof Error ? err.message : 'Failed to update bookmark')
    }
  }

  // ── Edit post ────────────────────────────────────────────────────────────────

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id)
    setEditPostTitle(post.title ?? '')
    setEditPostContent(post.content)
  }

  const handleSavePost = async (postId: number) => {
    if (!editPostContent.trim()) return
    setEditPostSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editPostTitle, content: editPostContent }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to update post')
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, title: data.title, content: data.content } : p
        )
      )
      setEditingPostId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update post')
    } finally {
      setEditPostSubmitting(false)
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Failed to delete post')
    }
  }

  // ── Comments ─────────────────────────────────────────────────────────────────

  const toggleComments = async (postId: number) => {
    const next = new Set(expandedPosts)
    if (next.has(postId)) {
      next.delete(postId)
      setExpandedPosts(next)
      return
    }
    next.add(postId)
    setExpandedPosts(next)

    // Only fetch if not already loaded
    if (commentsMap[postId] !== undefined) return

    setCommentLoadingMap((prev) => ({ ...prev, [postId]: true }))
    try {
      const res = await fetch(`/api/posts/${postId}/comments`)
      if (!res.ok) throw new Error('Failed to fetch comments')
      const data: Comment[] = await res.json()
      setCommentsMap((prev) => ({ ...prev, [postId]: data }))
    } catch {
      setCommentsMap((prev) => ({ ...prev, [postId]: [] }))
    } finally {
      setCommentLoadingMap((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleSubmitComment = async (postId: number) => {
    const commentContent = (commentInputMap[postId] ?? '').trim()
    if (!commentContent) return

    setCommentSubmittingMap((prev) => ({ ...prev, [postId]: true }))
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to post comment')

      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), data],
      }))
      setCommentInputMap((prev) => ({ ...prev, [postId]: '' }))
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to post comment')
    } finally {
      setCommentSubmittingMap((prev) => ({ ...prev, [postId]: false }))
    }
  }

  // ── Edit comment ─────────────────────────────────────────────────────────────

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditCommentContent(comment.content)
  }

  const handleSaveComment = async (postId: number, commentId: number) => {
    if (!editCommentContent.trim()) return
    setEditCommentSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editCommentContent }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to update comment')
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? []).map((c) =>
          c.id === commentId ? { ...c, content: data.content } : c
        ),
      }))
      setEditingCommentId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update comment')
    } finally {
      setEditCommentSubmitting(false)
    }
  }

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? []).filter((c) => c.id !== commentId),
      }))
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comment_count: Math.max(0, p.comment_count - 1) } : p
        )
      )
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Failed to delete comment')
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border bg-card p-6">
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
          Ensure PostgreSQL is running and you&apos;ve run db/schema.sql and db/seed.sql.
        </p>
        <button onClick={fetchPosts} className="mt-3 text-sm underline hover:no-underline">
          Retry
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No posts yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
<<<<<<< Updated upstream
=======
      {/* ── Create post ── */}
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
              <label htmlFor="post-title" className="block text-sm text-muted-foreground">
                Title <span className="text-xs">(optional)</span>
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Give your post a short title"
              />
            </div>

            <div>
              <label htmlFor="post-content" className="block text-sm text-muted-foreground">
                Your post
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="What would you like to share?"
                required
              />
            </div>

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

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

>>>>>>> Stashed changes
      {authReady && !userEmail && (
        <p className="rounded-2xl border border-secondary/30 bg-secondary/10 p-3 text-sm text-accent">
          Sign in to bookmark posts and save your favorites.
        </p>
      )}
<<<<<<< Updated upstream
      {posts.map((post) => (
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
              <p className="mt-2 text-sm leading-relaxed text-foreground">{post.content}</p>
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
      ))}
=======

      {/* ── Posts ── */}
      {posts.length === 0 ? (
        <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
          No posts yet.
        </p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border bg-card shadow-sm transition hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Post body / inline edit */}
                <div className="min-w-0 flex-1">
                  {editingPostId === post.id ? (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor={`edit-title-${post.id}`}
                          className="block text-sm text-muted-foreground"
                        >
                          Title <span className="text-xs">(optional)</span>
                        </label>
                        <input
                          id={`edit-title-${post.id}`}
                          type="text"
                          value={editPostTitle}
                          onChange={(e) => setEditPostTitle(e.target.value)}
                          maxLength={255}
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`edit-content-${post.id}`}
                          className="block text-sm text-muted-foreground"
                        >
                          Your post
                        </label>
                        <textarea
                          id={`edit-content-${post.id}`}
                          value={editPostContent}
                          onChange={(e) => setEditPostContent(e.target.value)}
                          rows={4}
                          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSavePost(post.id)}
                          disabled={editPostSubmitting || !editPostContent.trim()}
                          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {editPostSubmitting ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingPostId(null)}
                          disabled={editPostSubmitting}
                          className="rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                {/* Right-side actions */}
                <div className="flex shrink-0 items-center gap-0.5">
                  {userId !== null &&
                    post.author_id === userId &&
                    editingPostId !== post.id && (
                      <>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label="Edit post"
                          title="Edit post"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete post"
                          title="Delete post"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
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
                    {post.bookmarked ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                  </button>
                </div>
              </div>

              {/* Comments toggle */}
              {editingPostId !== post.id && (
                <div className="mt-4 border-t pt-3">
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <MessageCircle size={16} />
                    <span>
                      {expandedPosts.has(post.id)
                        ? 'Hide comments'
                        : `${post.comment_count} comment${post.comment_count !== 1 ? 's' : ''}`}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* ── Comment section ── */}
            {expandedPosts.has(post.id) && (
              <div className="border-t bg-muted/20 px-6 py-5">
                {commentLoadingMap[post.id] ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse space-y-1">
                        <div className="h-3 w-1/4 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(commentsMap[post.id] ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No comments yet. Be the first!
                      </p>
                    ) : (
                      (commentsMap[post.id] ?? []).map((comment) => (
                        <div key={comment.id} className="group">
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editCommentContent}
                                onChange={(e) => setEditCommentContent(e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveComment(post.id, comment.id)}
                                  disabled={
                                    editCommentSubmitting || !editCommentContent.trim()
                                  }
                                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                  {editCommentSubmitting ? 'Saving…' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingCommentId(null)}
                                  disabled={editCommentSubmitting}
                                  className="rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground">
                                  {comment.author_name && (
                                    <span className="font-medium text-foreground">
                                      {comment.author_name}
                                    </span>
                                  )}
                                  {comment.author_name && ' · '}
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-foreground">
                                  {comment.content}
                                </p>
                              </div>
                              {userId !== null && comment.author_id === userId && (
                                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                                  <button
                                    onClick={() => handleEditComment(comment)}
                                    className="flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    aria-label="Edit comment"
                                    title="Edit comment"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(post.id, comment.id)
                                    }
                                    className="flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                                    aria-label="Delete comment"
                                    title="Delete comment"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {/* Comment form */}
                    {userEmail ? (
                      <div className="mt-2 border-t pt-4">
                        <textarea
                          value={commentInputMap[post.id] ?? ''}
                          onChange={(e) =>
                            setCommentInputMap((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                          placeholder="Write a comment…"
                        />
                        <button
                          onClick={() => handleSubmitComment(post.id)}
                          disabled={
                            commentSubmittingMap[post.id] ||
                            !(commentInputMap[post.id] ?? '').trim()
                          }
                          className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {commentSubmittingMap[post.id] ? 'Posting…' : 'Post comment'}
                        </button>
                      </div>
                    ) : (
                      <p className="mt-2 rounded-2xl border border-secondary/30 bg-secondary/10 p-3 text-sm text-accent">
                        Sign in to leave a comment.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </article>
        ))
      )}
>>>>>>> Stashed changes
    </div>
  )
}
