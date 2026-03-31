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

interface PostsPageResponse {
  posts: PostWithBookmark[]
  hasMore: boolean
  nextOffset: number | null
}

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUserFromRequest(request)
    const userId = sessionUser?.id ?? null
    const limitParam = Number.parseInt(request.nextUrl.searchParams.get('limit') ?? '', 10)
    const offsetParam = Number.parseInt(request.nextUrl.searchParams.get('offset') ?? '', 10)
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 20) : 10
    const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0

    const postsResult = await query<{
      id: number
      author_id: number | null
      title: string | null
      content: string
      created_at: string
      display_name: string | null
      comment_count: string
    }>(
      `WITH paginated_posts AS (
         SELECT cp.id, cp.author_id, cp.title, cp.content, cp.created_at, u.display_name
         FROM community_posts cp
         LEFT JOIN users u ON cp.author_id = u.id
         ORDER BY cp.created_at DESC, cp.id DESC
         LIMIT $1
         OFFSET $2
       )
       SELECT pp.id, pp.author_id, pp.title, pp.content, pp.created_at, pp.display_name,
              COUNT(pc.id) AS comment_count
       FROM paginated_posts pp
       LEFT JOIN post_comments pc ON pc.post_id = pp.id
       GROUP BY pp.id, pp.author_id, pp.title, pp.content, pp.created_at, pp.display_name
       ORDER BY pp.created_at DESC, pp.id DESC`,
      [limit + 1, offset]
    )

    let bookmarkedIds: Set<number> = new Set()
    const paginatedRows = postsResult.rows.slice(0, limit)
    const postIds = paginatedRows.map((row) => row.id)

    if (userId && postIds.length > 0) {
      const bookmarksResult = await query<{ post_id: number }>(
        'SELECT post_id FROM user_post_bookmarks WHERE user_id = $1 AND post_id = ANY($2::int[])',
        [userId, postIds]
      )
      bookmarkedIds = new Set(bookmarksResult.rows.map((r) => r.post_id))
    }

    const posts: PostWithBookmark[] = paginatedRows.map((row) => ({
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      content: row.content,
      created_at: row.created_at,
      author_name: row.display_name,
      bookmarked: bookmarkedIds.has(row.id),
      comment_count: parseInt(row.comment_count, 10) || 0,
    }))

    const response: PostsPageResponse = {
      posts,
      hasMore: postsResult.rows.length > limit,
      nextOffset: postsResult.rows.length > limit ? offset + posts.length : null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('GET /api/posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userEmail =
      typeof body.userEmail === 'string' ? body.userEmail.trim() : ''
    const rawTitle = typeof body.title === 'string' ? body.title.trim() : ''
    const content = typeof body.content === 'string' ? body.content.trim() : ''

    if (!userEmail) {
      return NextResponse.json(
        { error: 'You must be signed in to create a post.' },
        { status: 401 }
      )
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Post content is required.' },
        { status: 400 }
      )
    }

    if (rawTitle.length > 255) {
      return NextResponse.json(
        { error: 'Title must be 255 characters or fewer.' },
        { status: 400 }
      )
    }

    const userResult = await query<{ id: number }>(
      'SELECT id FROM users WHERE email = $1',
      [userEmail]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Could not find a user for this account.' },
        { status: 404 }
      )
    }

    const authorId = userResult.rows[0].id
    const title = rawTitle || null

    const postResult = await query<{
      id: number
      author_id: number | null
      title: string | null
      content: string
      created_at: string
      display_name: string | null
    }>(
      `INSERT INTO community_posts (author_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, author_id, title, content, created_at,
         (SELECT display_name FROM users WHERE id = author_id) AS display_name`,
      [authorId, title, content]
    )

    const createdPost: PostWithBookmark = {
      id: postResult.rows[0].id,
      author_id: postResult.rows[0].author_id,
      title: postResult.rows[0].title,
      content: postResult.rows[0].content,
      created_at: postResult.rows[0].created_at,
      author_name: postResult.rows[0].display_name,
      bookmarked: false,
      comment_count: 0,
    }

    return NextResponse.json(createdPost, { status: 201 })
  } catch (error) {
    console.error('POST /api/posts error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
