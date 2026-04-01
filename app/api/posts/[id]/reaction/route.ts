import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getSessionUserFromRequest } from '@/lib/session'

const ALLOWED_REACTIONS = ['❤️', '👍', '🙌', '🙏', '🥹', '💕'] as const

function isAllowedReaction(s: string): boolean {
  return (ALLOWED_REACTIONS as readonly string[]).includes(s)
}

async function reactionCountsForPost(postId: number): Promise<Record<string, number>> {
  const result = await query<{ reaction: string; count: number }>(
    'SELECT reaction, COUNT(*)::int AS count FROM post_reactions WHERE post_id = $1 GROUP BY reaction',
    [postId]
  )
  const out: Record<string, number> = {}
  for (const row of result.rows) {
    out[row.reaction] = row.count
  }
  return out
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
    const userId = sessionUser.id

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || !('reaction' in body)) {
      return NextResponse.json(
        { error: 'Body must include reaction (string or null).' },
        { status: 400 }
      )
    }

    const raw = (body as { reaction: unknown }).reaction
    if (raw !== null && typeof raw !== 'string') {
      return NextResponse.json({ error: 'reaction must be a string or null.' }, { status: 400 })
    }

    const reaction = raw === null ? null : raw

    if (reaction !== null && !isAllowedReaction(reaction)) {
      return NextResponse.json({ error: 'Invalid reaction.' }, { status: 400 })
    }

    const postExists = await query<{ id: number }>(
      'SELECT id FROM community_posts WHERE id = $1',
      [postId]
    )
    if (postExists.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    }

    let myReaction: string | null

    if (reaction === null) {
      await query('DELETE FROM post_reactions WHERE user_id = $1 AND post_id = $2', [
        userId,
        postId,
      ])
      myReaction = null
    } else {
      await query(
        `INSERT INTO post_reactions (user_id, post_id, reaction)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, post_id) DO UPDATE SET
           reaction = EXCLUDED.reaction,
           created_at = NOW()`,
        [userId, postId, reaction]
      )
      myReaction = reaction
    }

    const reaction_counts = await reactionCountsForPost(postId)

    return NextResponse.json({ my_reaction: myReaction, reaction_counts })
  } catch (error) {
    console.error('POST /api/posts/[id]/reaction error:', error)
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 })
  }
}
