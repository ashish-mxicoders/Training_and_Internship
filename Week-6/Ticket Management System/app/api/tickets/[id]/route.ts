// =====================================================================
// API Route: /api/tickets/[id]
// Method: GET, PATCH, DELETE
// Powered by Modern Prisma 7 ORM.
//
// Role-based restrictions:
// - Customer:
//   - Cannot delete tickets (returns 403 Forbidden).
//   - Cannot change ticket status (only admin can change status).
// - Admin:
//   - Full access to update status, priority, assignee, SLA, or delete ticket.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

// Helper function to map Prisma ticket record to front-end Ticket model
function mapPrismaTicket(t: any) {
  return {
    id: t.id,
    subject: t.subject,
    description: t.description,
    status: t.status,
    priority: t.priority,
    category: t.categoryId || 'other',
    channel: t.channel,
    health: t.health,
    dueDate: t.dueDate,
    isEscalated: t.isEscalated ?? false,
    isPastDue: t.isPastDue ?? false,
    tags: t.tags || [],
    createdAt: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '',
    updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString().split('T')[0] : '',
    assignee: t.assignee
      ? {
          id: t.assignee.id,
          name: t.assignee.name,
          email: t.assignee.email,
          initials: t.assignee.initials,
          avatar: t.assignee.avatar || undefined,
          role: t.assignee.role || 'Support Engineer',
        }
      : undefined,
    customer: {
      name: t.customerName || t.customer?.name || 'Customer',
      company: t.customerCompany || t.customer?.company || 'Organization',
      email: t.customerEmail || t.customer?.email || 'client@example.com',
      avatar: t.customer?.avatar || undefined,
    },
    comments: (t.comments || []).map((c: any) => ({
      id: c.id,
      authorName: c.authorName,
      authorAvatar: c.authorAvatar || undefined,
      authorInitials: c.authorInitials,
      content: c.content,
      timestamp: c.timestampDisplay,
    })),
  };
}

// GET single ticket by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        assignee: true,
        customer: true,
        comments: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({
      ticket: mapPrismaTicket(ticket),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch ticket';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PATCH update ticket
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    const { id } = await params;
    const body = await req.json();

    // Check if user is customer trying to change status
    if (user && user.role === 'customer' && body.status !== undefined) {
      return NextResponse.json(
        { error: 'Customers are not permitted to change ticket status' },
        { status: 403 }
      );
    }

    const dataToUpdate: any = {};

    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.priority !== undefined) dataToUpdate.priority = body.priority;
    if (body.health !== undefined) dataToUpdate.health = body.health;
    if (body.assigneeId !== undefined) dataToUpdate.assigneeId = body.assigneeId || null;
    if (body.isEscalated !== undefined) dataToUpdate.isEscalated = Boolean(body.isEscalated);
    if (body.subject !== undefined) dataToUpdate.subject = body.subject;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.dueDate !== undefined) dataToUpdate.dueDate = body.dueDate;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: 'No fields to update' });
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      id: updated.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update ticket';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE ticket
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);

    // Customer CANNOT delete tickets!
    if (user && user.role === 'customer') {
      return NextResponse.json(
        { error: 'Customers do not have permission to delete tickets' },
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete ticket';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
