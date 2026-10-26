// =====================================================================
// API Route: /api/tickets/[id]/comments
// Method: POST
// Adds a new comment or message to the ticket conversation.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    const { id: rawId } = await params;
    const body = await req.json();
    const { content, authorName, authorInitials } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    const ticketId = rawId.startsWith('#-') ? rawId : `#-0${rawId.padStart(2, '0')}`;
    const commentId = `cm-${Date.now().toString().slice(-6)}`;

    const finalAuthorName = user?.name || authorName || 'Support Team';
    const finalAuthorInitials = user?.initials || authorInitials || 'ST';
    const finalAuthorAvatar = user?.avatar || null;
    const finalAuthorId = user?.userId || null;

    const now = new Date();
    const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await query(
      `
      INSERT INTO comments (
        id, ticket_id, author_id, author_name, author_avatar,
        author_initials, is_internal, content, timestamp_display, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW());
      `,
      [
        commentId,
        ticketId,
        finalAuthorId,
        finalAuthorName,
        finalAuthorAvatar,
        finalAuthorInitials,
        false,
        content.trim(),
        timeStr,
      ]
    );

    return NextResponse.json({
      success: true,
      comment: {
        id: commentId,
        authorName: finalAuthorName,
        authorAvatar: finalAuthorAvatar,
        authorInitials: finalAuthorInitials,
        isInternal: false,
        content: content.trim(),
        timestamp: timeStr,
      },
    });
  } catch (error: any) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
}
