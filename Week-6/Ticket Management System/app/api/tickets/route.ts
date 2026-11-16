// =====================================================================
// API Route: /api/tickets
// Method: GET, POST
// Handles fetching tickets and creating new tickets via Modern Prisma 7 ORM.
//
// Role-Based Access:
// - Customer: Only sees tickets created by their account (customerId / customerEmail).
// - Admin: Sees ALL tickets across the entire organization.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all tickets (filtered by Role via Prisma)
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);

    const whereClause: any = {};

    // If logged in as Customer, ONLY return customer's own tickets!
    if (user && user.role === 'customer') {
      whereClause.OR = [
        { customerId: user.userId },
        { customerEmail: { equals: user.email, mode: 'insensitive' } },
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: true,
        customer: true,
        comments: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const mappedTickets = tickets.map(mapPrismaTicket);

    return NextResponse.json({ tickets: mappedTickets });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tickets';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// POST create a new ticket via Prisma
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const body = await req.json();

    const {
      subject,
      description,
      status = 'open',
      priority = 'high',
      category = 'technical',
      channel = 'email',
      health = 'on_track',
      assigneeId,
      customerName,
      companyName,
      customerEmail,
      dueDate,
      isEscalated = false,
      tags = [],
    } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { error: 'Ticket subject is required' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Ticket description is required' },
        { status: 400 }
      );
    }

    // Generate next ticket ID: sequential number
    const allTickets = await prisma.ticket.findMany({
      select: { id: true },
    });
    let maxNum = 0;
    for (const r of allTickets) {
      const n = parseInt(String(r.id).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(n) && n > maxNum) {
        maxNum = n;
      }
    }
    const ticketId = String(maxNum + 1);

    // Calculate customer fields
    const finalCustId = user?.role === 'customer' ? user.userId : null;
    const finalCustName =
      user?.role === 'customer'
        ? user.name
        : customerName?.trim() || 'Enterprise Client';
    const finalCustEmail =
      user?.role === 'customer'
        ? user.email
        : customerEmail?.trim() || 'contact@client.com';
    const finalCustCompany =
      user?.role === 'customer'
        ? user.company || 'Enterprise Partner'
        : companyName?.trim() || 'Acme Partner';

    const finalDueDate =
      dueDate ||
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const finalStatus = status === 'escalated' ? 'open' : status;
    const shouldEscalate = Boolean(isEscalated || status === 'escalated');

    // Insert into PostgreSQL tickets table via Prisma
    const createdTicket = await prisma.ticket.create({
      data: {
        id: ticketId,
        subject: subject.trim(),
        description: description?.trim() || 'No additional details provided.',
        status: finalStatus as any,
        priority: priority as any,
        categoryId: category,
        channel: channel as any,
        health: health as any,
        assigneeId: assigneeId ? assigneeId : null,
        customerId: finalCustId,
        customerName: finalCustName,
        customerCompany: finalCustCompany,
        customerEmail: finalCustEmail,
        dueDate: finalDueDate,
        isEscalated: shouldEscalate,
        isPastDue: false,
        tags,
      },
      include: {
        assignee: true,
        customer: true,
        comments: true,
      },
    });

    const ticket = mapPrismaTicket(createdTicket);

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create ticket';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
