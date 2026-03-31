import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSessionUserFromRequest } from '@/lib/session'

export interface PostWithBookmark {
  id: number
  author_id: number | null
  title: string | null
  content: string
  created_at: string
  bookmarked: boolean
  author_name: string | null
  comment_count: number
}

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUserFromRequest(request)
    const userId = sessionUser?.id ?? null

    const postsResult = await query<{
      id: number
      author_id: number | null
      title: string | null
      content: string
      created_at: string
      display_name: string | null
      comment_count: string
    }>(
      `SELECT cp.id, cp.author_id, cp.title, cp.content, cp.created_at, u.display_name,
              COUNT(pc.id) AS comment_count
       FROM community_posts cp
       LEFT JOIN users u ON cp.author_id = u.id
       LEFT JOIN post_comments pc ON pc.post_id = cp.id
       GROUP BY cp.id, u.display_name
       ORDER BY cp.created_at DESC`
    )

    let bookmarkedIds: Set<number> = new Set()
    if (userId) {
      const bookmarksResult = await query<{ post_id: number }>(
        'SELECT post_id FROM user_post_bookmarks WHERE user_id = $1',
        [userId]
      )
      bookmarkedIds = new Set(bookmarksResult.rows.map((r) => r.post_id))
    }

    const posts: PostWithBookmark[] = postsResult.rows.map((row) => ({
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      content: row.content,
      created_at: row.created_at,
      author_name: row.display_name,
      bookmarked: bookmarkedIds.has(row.id),
      comment_count: parseInt(row.comment_count, 10) || 0,
    }))

    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET /api/posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
