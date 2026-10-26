// =====================================================================
// API Route: /api/tickets
// Method: GET, POST
// Handles fetching tickets and creating new tickets.
//
// Role-Based Access:
// - Customer: Only sees tickets created by their account (customer_id / customer_email).
// - Admin: Sees ALL tickets across the entire organization.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { getSessionUser } from '@/lib/auth';

// Helper function to map raw SQL ticket row + comments to our Ticket model
function mapTicketRow(row: any, comments: any[] = []) {
  return {
    id: row.id,
    subject: row.subject,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category_id || 'other',
    channel: row.channel,
    health: row.health,
    dueDate: row.due_date,
    isEscalated: row.is_escalated,
    isPastDue: row.is_past_due,
    tags: row.tags || [],
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : '',
    assignee: row.assignee_id
      ? {
          id: row.assignee_id,
          name: row.assignee_name,
          email: row.assignee_email,
          initials: row.assignee_initials,
          avatar: row.assignee_avatar || undefined,
          role: row.assignee_role || 'Support Engineer',
        }
      : undefined,
    customer: {
      name: row.customer_name || 'Customer',
      company: row.customer_company || 'Organization',
      email: row.customer_email || 'client@example.com',
      avatar: row.customer_avatar || undefined,
      tier: row.customer_tier || 'Enterprise',
    },
    comments: comments.map((c) => ({
      id: c.id,
      authorName: c.author_name,
      authorAvatar: c.author_avatar || undefined,
      authorInitials: c.author_initials,
      isInternal: c.is_internal || false,
      content: c.content,
      timestamp: c.timestamp_display,
    })),
  };
}

// GET all tickets (filtered by Role)
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);

    // Build SQL query depending on user role
    let sql = `
      SELECT
        t.*,
        u_assignee.name AS assignee_name,
        u_assignee.email AS assignee_email,
        u_assignee.initials AS assignee_initials,
        u_assignee.avatar AS assignee_avatar,
        u_assignee.role AS assignee_role,
        u_cust.avatar AS customer_avatar
      FROM tickets t
      LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
      LEFT JOIN users u_cust ON t.customer_id = u_cust.id
    `;

    const params: any[] = [];

    // If logged in as Customer, ONLY return customer's own tickets!
    if (user && user.role === 'customer') {
      sql += ` WHERE t.customer_id = $1 OR LOWER(t.customer_email) = LOWER($2)`;
      params.push(user.userId, user.email);
    }

    sql += ` ORDER BY t.created_at DESC;`;

    const ticketsRes = await query(sql, params);

    // Fetch all comments for these tickets
    const commentsRes = await query(
      `SELECT * FROM comments ORDER BY created_at ASC;`
    );

    // Group comments by ticket_id
    const commentsByTicket: Record<string, any[]> = {};
    for (const c of commentsRes.rows) {
      if (!commentsByTicket[c.ticket_id]) {
        commentsByTicket[c.ticket_id] = [];
      }
      commentsByTicket[c.ticket_id].push(c);
    }

    const mappedTickets = ticketsRes.rows.map((row) =>
      mapTicketRow(row, commentsByTicket[row.id] || [])
    );

    return NextResponse.json({ tickets: mappedTickets });
  } catch (error: any) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST create a new ticket
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

    // Generate next ticket ID: count existing tickets
    const countRes = await query(`SELECT COUNT(*) FROM tickets;`);
    const count = parseInt(countRes.rows[0].count, 10) + 1;
    const formattedId = `#-0${count < 10 ? '0' + count : count}`;

    // Calculate customer fields: if customer is logged in, use their info
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

    // Insert into PostgreSQL tickets table
    await query(
      `
      INSERT INTO tickets (
        id, subject, description, status, priority, category_id,
        channel, health, assignee_id, customer_id, customer_name,
        customer_company, customer_email, customer_tier, due_date,
        is_escalated, is_past_due, tags, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW());
      `,
      [
        formattedId,
        subject.trim(),
        description?.trim() || 'No additional details provided.',
        finalStatus,
        priority,
        category,
        channel,
        health,
        assigneeId ? assigneeId : null,
        finalCustId,
        finalCustName,
        finalCustCompany,
        finalCustEmail,
        'Enterprise',
        finalDueDate,
        shouldEscalate,
        false,
        tags,
      ]
    );

    // Fetch newly created ticket with joins
    const newTicketRes = await query(
      `
      SELECT
        t.*,
        u_assignee.name AS assignee_name,
        u_assignee.email AS assignee_email,
        u_assignee.initials AS assignee_initials,
        u_assignee.avatar AS assignee_avatar,
        u_assignee.role AS assignee_role,
        u_cust.avatar AS customer_avatar
      FROM tickets t
      LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
      LEFT JOIN users u_cust ON t.customer_id = u_cust.id
      WHERE t.id = $1;
      `,
      [formattedId]
    );

    const ticket = mapTicketRow(newTicketRes.rows[0], []);

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
