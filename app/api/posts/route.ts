import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export interface PostWithBookmark {
  id: number
  author_id: number | null
  title: string | null
  content: string
  created_at: string
  bookmarked: boolean
  author_name: string | null
}

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.nextUrl.searchParams.get('userEmail')
    let userId: number | null = null

    if (userEmail) {
      const userResult = await query<{ id: number }>(
        'SELECT id FROM users WHERE email = $1',
        [userEmail]
      )
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id
      }
    }

    const postsResult = await query<{
      id: number
      author_id: number | null
      title: string | null
      content: string
      created_at: string
      display_name: string | null
    }>(
      `SELECT cp.id, cp.author_id, cp.title, cp.content, cp.created_at, u.display_name
       FROM community_posts cp
       LEFT JOIN users u ON cp.author_id = u.id
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
