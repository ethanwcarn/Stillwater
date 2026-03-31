import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSessionUserFromRequest } from '@/lib/session'

interface CommentRow {
  id: number
  post_id: number
  author_id: number | null
  content: string
  created_at: string
  display_name: string | null
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id, 10)
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const result = await query<CommentRow>(
      `SELECT pc.id, pc.post_id, pc.author_id, pc.content, pc.created_at, u.display_name
       FROM post_comments pc
       LEFT JOIN users u ON pc.author_id = u.id
       WHERE pc.post_id = $1
       ORDER BY pc.created_at ASC`,
      [postId]
    )

    const comments = result.rows.map((row) => ({
      id: row.id,
      post_id: row.post_id,
      author_id: row.author_id,
      content: row.content,
      created_at: row.created_at,
      author_name: row.display_name,
    }))

    return NextResponse.json(comments)
  } catch (error) {
    console.error('GET /api/posts/[id]/comments error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id, 10)
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const sessionUser = await getSessionUserFromRequest(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const content = typeof body.content === 'string' ? body.content.trim() : ''

    if (!content) {
      return NextResponse.json({ error: 'Comment content is required.' }, { status: 400 })
    }

    // Verify the post exists
    const postCheck = await query<{ id: number }>(
      'SELECT id FROM community_posts WHERE id = $1',
      [postId]
    )
    if (postCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    }

    const result = await query<CommentRow>(
      `INSERT INTO post_comments (post_id, author_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, post_id, author_id, content, created_at,
         (SELECT display_name FROM users WHERE id = $2) AS display_name`,
      [postId, sessionUser.id, content]
    )

    const row = result.rows[0]
    return NextResponse.json(
      {
        id: row.id,
        post_id: row.post_id,
        author_id: row.author_id,
        content: row.content,
        created_at: row.created_at,
        author_name: row.display_name,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/posts/[id]/comments error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
