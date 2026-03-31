import Link from 'next/link'
import { cookies } from 'next/headers'
import { ArrowLeft } from 'lucide-react'
import { query } from '@/lib/db'
import { getSessionUserFromCookieStore } from '@/lib/session'
import { BookmarkedPostsList } from './bookmarked-posts-list'

type BookmarkedPost = {
  id: number
  title: string | null
  content: string
  created_at: string
  author_name: string | null
}

async function getBookmarkedPosts(userId: number): Promise<BookmarkedPost[]> {
  const result = await query<BookmarkedPost>(
    `
      SELECT
        cp.id,
        cp.title,
        cp.content,
        cp.created_at,
        u.display_name AS author_name
      FROM user_post_bookmarks upb
      JOIN community_posts cp ON cp.id = upb.post_id
      LEFT JOIN users u ON u.id = cp.author_id
      WHERE upb.user_id = $1
      ORDER BY upb.created_at DESC
    `,
    [userId]
  )

  return result.rows
}

export default async function BookmarkedPostsPage() {
  const cookieStore = await cookies()
  const sessionUser = await getSessionUserFromCookieStore(cookieStore)

  if (!sessionUser) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Bookmarked Posts
        </h1>
        <div className="mt-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
          <p className="text-muted-foreground">
            You need to sign in before you can view bookmarked posts.
          </p>
          <Link
            href="/signin"
            className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    )
  }

  const posts = await getBookmarkedPosts(sessionUser.id)

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Bookmarked Posts
        </h1>
        <Link
          href="/profile"
          className="inline-flex items-center rounded-xl border border-border/60 px-3 py-2 text-sm text-foreground hover:bg-muted/60"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </div>

      <BookmarkedPostsList initialPosts={posts} />
    </main>
  )
}
