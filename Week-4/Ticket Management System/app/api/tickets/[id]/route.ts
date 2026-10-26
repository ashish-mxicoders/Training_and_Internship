// =====================================================================
// API Route: /api/tickets/[id]
// Method: GET, PATCH, DELETE
//
// Role-based restrictions:
// - Customer:
//   - Cannot delete tickets (returns 403 Forbidden).
//   - Cannot change ticket status (only admin can change status).
// - Admin:
//   - Full access to update status, priority, assignee, SLA, or delete ticket.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { getSessionUser } from '@/lib/auth';

// Helper function to map ticket
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

// GET single ticket by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const ticketId = rawId.startsWith('#-') ? rawId : `#-0${rawId.padStart(2, '0')}`;

    const res = await query(
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
      WHERE t.id = $1 OR t.id = $2;
      `,
      [rawId, ticketId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const commentsRes = await query(
      `SELECT * FROM comments WHERE ticket_id = $1 ORDER BY created_at ASC;`,
      [res.rows[0].id]
    );

    return NextResponse.json({
      ticket: mapTicketRow(res.rows[0], commentsRes.rows),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ticket' },
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
    const { id: rawId } = await params;
    const body = await req.json();

    // Check if user is customer trying to change status
    if (user && user.role === 'customer' && body.status !== undefined) {
      return NextResponse.json(
        { error: 'Customers are not permitted to change ticket status' },
        { status: 403 }
      );
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (body.status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(body.status);
    }
    if (body.priority !== undefined) {
      updates.push(`priority = $${idx++}`);
      values.push(body.priority);
    }
    if (body.health !== undefined) {
      updates.push(`health = $${idx++}`);
      values.push(body.health);
    }
    if (body.assigneeId !== undefined) {
      updates.push(`assignee_id = $${idx++}`);
      values.push(body.assigneeId || null);
    }
    if (body.isEscalated !== undefined) {
      updates.push(`is_escalated = $${idx++}`);
      values.push(Boolean(body.isEscalated));
    }
    if (body.subject !== undefined) {
      updates.push(`subject = $${idx++}`);
      values.push(body.subject);
    }
    if (body.description !== undefined) {
      updates.push(`description = $${idx++}`);
      values.push(body.description);
    }
    if (body.dueDate !== undefined) {
      updates.push(`due_date = $${idx++}`);
      values.push(body.dueDate);
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      return NextResponse.json({ message: 'No fields to update' });
    }

    const ticketId = rawId.startsWith('#-') ? rawId : `#-0${rawId.padStart(2, '0')}`;
    values.push(ticketId, rawId);

    const updateSql = `
      UPDATE tickets
      SET ${updates.join(', ')}
      WHERE id = $${idx++} OR id = $${idx++}
      RETURNING id;
    `;

    const result = await query(updateSql, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      id: result.rows[0].id,
    });
  } catch (error: any) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update ticket' },
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
    // "customer m dashboard me simple sirrf create tikcet ka option dege usko vo delete ni kr payega"
    if (user && user.role === 'customer') {
      return NextResponse.json(
        { error: 'Customers do not have permission to delete tickets' },
        { status: 403 }
      );
    }

    const { id: rawId } = await params;
    const ticketId = rawId.startsWith('#-') ? rawId : `#-0${rawId.padStart(2, '0')}`;

    await query(`DELETE FROM tickets WHERE id = $1 OR id = $2;`, [rawId, ticketId]);

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete ticket error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}
