import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSessionUserFromRequest } from '@/lib/session'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params
    const postId = parseInt(id, 10)
    const cId = parseInt(commentId, 10)
    if (isNaN(postId) || isNaN(cId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
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

    const existing = await query<{ author_id: number | null }>(
      'SELECT author_id FROM post_comments WHERE id = $1 AND post_id = $2',
      [cId, postId]
    )
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 })
    }
    if (existing.rows[0].author_id !== sessionUser.id) {
      return NextResponse.json(
        { error: 'You can only edit your own comments.' },
        { status: 403 }
      )
    }

    const result = await query<{
      id: number
      post_id: number
      author_id: number | null
      content: string
      created_at: string
    }>(
      `UPDATE post_comments SET content = $1 WHERE id = $2
       RETURNING id, post_id, author_id, content, created_at`,
      [content, cId]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('PATCH /api/posts/[id]/comments/[commentId] error:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params
    const postId = parseInt(id, 10)
    const cId = parseInt(commentId, 10)
    if (isNaN(postId) || isNaN(cId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const sessionUser = await getSessionUserFromRequest(request)
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const existing = await query<{ author_id: number | null }>(
      'SELECT author_id FROM post_comments WHERE id = $1 AND post_id = $2',
      [cId, postId]
    )
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 })
    }
    if (existing.rows[0].author_id !== sessionUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own comments.' },
        { status: 403 }
      )
    }

    await query('DELETE FROM post_comments WHERE id = $1', [cId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/posts/[id]/comments/[commentId] error:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
