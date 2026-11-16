// =====================================================================
// API Route: /api/tickets/[id]/comments
// Method: POST
// Adds a new comment or message to the ticket conversation.
// Powered by Modern Prisma 7 ORM.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    const { id: ticketId } = await params;
    const body = await req.json();
    const { content, authorName, authorInitials } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    const commentId = `cm-${Date.now().toString().slice(-6)}`;

    const finalAuthorName = user?.name || authorName || 'Support Team';
    const finalAuthorInitials = user?.initials || authorInitials || 'ST';
    const finalAuthorAvatar = user?.avatar || null;
    const finalAuthorId = user?.userId || null;

    const now = new Date();
    const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await prisma.comment.create({
      data: {
        id: commentId,
        ticketId: ticketId,
        authorId: finalAuthorId,
        authorName: finalAuthorName,
        authorAvatar: finalAuthorAvatar,
        authorInitials: finalAuthorInitials,
        content: content.trim(),
        timestampDisplay: timeStr,
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: commentId,
        authorName: finalAuthorName,
        authorAvatar: finalAuthorAvatar,
        authorInitials: finalAuthorInitials,
        content: content.trim(),
        timestamp: timeStr,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add comment';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
