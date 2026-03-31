import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSessionUserFromRequest } from '@/lib/session'

export async function PATCH(
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
    const rawTitle = typeof body.title === 'string' ? body.title.trim() : ''
    const content = typeof body.content === 'string' ? body.content.trim() : ''

    if (!content) {
      return NextResponse.json({ error: 'Post content is required.' }, { status: 400 })
    }
    if (rawTitle.length > 255) {
      return NextResponse.json(
        { error: 'Title must be 255 characters or fewer.' },
        { status: 400 }
      )
    }

    const existing = await query<{ author_id: number | null }>(
      'SELECT author_id FROM community_posts WHERE id = $1',
      [postId]
    )
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    }
    if (existing.rows[0].author_id !== sessionUser.id) {
      return NextResponse.json(
        { error: 'You can only edit your own posts.' },
        { status: 403 }
      )
    }

    const title = rawTitle || null
    const result = await query<{
      id: number
      author_id: number | null
      title: string | null
      content: string
      created_at: string
    }>(
      `UPDATE community_posts SET title = $1, content = $2 WHERE id = $3
       RETURNING id, author_id, title, content, created_at`,
      [title, content, postId]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('PATCH /api/posts/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
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

    const existing = await query<{ author_id: number | null }>(
      'SELECT author_id FROM community_posts WHERE id = $1',
      [postId]
    )
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    }
    if (existing.rows[0].author_id !== sessionUser.id) {
      return NextResponse.json(
        { error: 'You can only delete your own posts.' },
        { status: 403 }
      )
    }

    await query('DELETE FROM community_posts WHERE id = $1', [postId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
