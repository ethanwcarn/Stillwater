import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSessionUserFromRequest } from '@/lib/session'

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
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    const userId = sessionUser.id

    const existing = await query<{ user_id: number }>(
      'SELECT user_id FROM user_post_bookmarks WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    )

    let bookmarked: boolean
    if (existing.rows.length > 0) {
      await query(
        'DELETE FROM user_post_bookmarks WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      )
      bookmarked = false
    } else {
      await query(
        'INSERT INTO user_post_bookmarks (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      )
      bookmarked = true
    }

    return NextResponse.json({ bookmarked })
  } catch (error) {
    console.error('POST /api/posts/[id]/bookmark error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    )
  }
}
