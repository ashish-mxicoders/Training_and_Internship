'use server';

// =====================================================================
// Next.js Server Actions: Ticket Operations
// Uses 'use server' to execute mutations securely on the server.
// Utilizes `revalidatePath` to automatically invalidate Next.js caches.
// =====================================================================

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db/db';
import { getSessionUser } from '@/lib/auth';
import {
  ActionResponse,
  CreateTicketInput,
  Ticket,
  TicketComment,
  TicketStatus,
  UpdateTicketInput,
} from '@/types';

/**
 * Server Action: Create a new ticket
 */
export async function createTicketAction(
  input: CreateTicketInput
): Promise<ActionResponse<Ticket>> {
  try {
    const session = await getSessionUser();

    const {
      subject,
      description,
      status = 'open',
      priority = 'medium',
      category = 'technical',
      channel = 'web',
      health = 'on_track',
      assigneeId = null,
      customerName,
      companyName,
      customerEmail,
      dueDate,
      isEscalated = false,
      tags = [],
    } = input;

    if (!subject || !subject.trim()) {
      return { success: false, error: 'Subject is required' };
    }

    if (!description || !description.trim()) {
      return { success: false, error: 'Description is required' };
    }

    // Determine numerical ID (e.g. '1', '2', ..., '21')
    const maxRes = await query(`SELECT id FROM tickets;`);
    let maxNum = 0;
    for (const r of maxRes.rows) {
      const n = parseInt(String(r.id).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
    const newId = String(maxNum + 1);

    const finalCustomerName = session?.name || customerName || 'New Client';
    const finalCompanyName = session?.company || companyName || 'Independent';
    const finalCustomerEmail = session?.email || customerEmail || 'client@example.com';
    const finalCustomerId = session?.userId || null;

    const insertSql = `
      INSERT INTO tickets (
        id, subject, description, status, priority, category_id,
        channel, health, assignee_id, customer_id, customer_name,
        customer_company, customer_email, due_date, is_escalated,
        is_past_due, tags, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15,
        false, $16, NOW(), NOW()
      )
      RETURNING *;
    `;

    const values = [
      newId,
      subject.trim(),
      description?.trim() || '',
      status,
      priority,
      category,
      channel,
      health,
      assigneeId || null,
      finalCustomerId,
      finalCustomerName,
      finalCompanyName,
      finalCustomerEmail,
      dueDate || null,
      Boolean(isEscalated),
      tags,
    ];

    const result = await query(insertSql, values);
    const row = result.rows[0];

    const newTicket: Ticket = {
      id: row.id,
      subject: row.subject,
      description: row.description,
      status: row.status,
      priority: row.priority,
      category: row.category_id || 'other',
      channel: row.channel,
      health: row.health,
      dueDate: row.due_date || '',
      isEscalated: row.is_escalated,
      isPastDue: false,
      tags: row.tags || [],
      createdAt: new Date(row.created_at).toISOString().split('T')[0],
      updatedAt: new Date(row.updated_at).toISOString().split('T')[0],
      customer: {
        name: row.customer_name,
        company: row.customer_company,
        email: row.customer_email,
      },
      comments: [],
    };

    // Revalidate Next.js cache for the tickets board
    revalidatePath('/tickets');

    return {
      success: true,
      message: 'Ticket created successfully',
      data: newTicket,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create ticket';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Update ticket status
 */
export async function updateTicketStatusAction(
  id: string,
  status: TicketStatus
): Promise<ActionResponse<void>> {
  try {
    const session = await getSessionUser();

    // Customer role is not permitted to change status
    if (session && session.role === 'customer') {
      return { success: false, error: 'Customers are not permitted to change ticket status' };
    }

    await query(
      `UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2;`,
      [status, id]
    );

    revalidatePath('/tickets');
    revalidatePath(`/tickets/${id}`);

    return { success: true, message: 'Status updated successfully' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update status';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Update ticket fields (priority, assignee, subject, etc.)
 */
export async function updateTicketAction(
  id: string,
  updates: UpdateTicketInput
): Promise<ActionResponse<void>> {
  try {
    const session = await getSessionUser();

    if (session && session.role === 'customer' && updates.status !== undefined) {
      return { success: false, error: 'Customers are not permitted to change ticket status' };
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (updates.status !== undefined) {
      setClauses.push(`status = $${idx++}`);
      values.push(updates.status);
    }
    if (updates.priority !== undefined) {
      setClauses.push(`priority = $${idx++}`);
      values.push(updates.priority);
    }
    if (updates.health !== undefined) {
      setClauses.push(`health = $${idx++}`);
      values.push(updates.health);
    }
    const targetAssigneeId =
      updates.assigneeId !== undefined
        ? updates.assigneeId
        : updates.assignee !== undefined
        ? updates.assignee?.id || null
        : undefined;

    if (targetAssigneeId !== undefined) {
      setClauses.push(`assignee_id = $${idx++}`);
      values.push(targetAssigneeId || null);
    }
    if (updates.isEscalated !== undefined) {
      setClauses.push(`is_escalated = $${idx++}`);
      values.push(Boolean(updates.isEscalated));
    }
    if (updates.subject !== undefined) {
      setClauses.push(`subject = $${idx++}`);
      values.push(updates.subject);
    }
    if (updates.description !== undefined) {
      setClauses.push(`description = $${idx++}`);
      values.push(updates.description);
    }
    if (updates.dueDate !== undefined) {
      setClauses.push(`due_date = $${idx++}`);
      values.push(updates.dueDate);
    }

    setClauses.push(`updated_at = NOW()`);

    if (setClauses.length === 1) {
      return { success: true, message: 'No fields to update' };
    }

    values.push(id);
    const sql = `UPDATE tickets SET ${setClauses.join(', ')} WHERE id = $${idx++};`;

    await query(sql, values);

    revalidatePath('/tickets');
    revalidatePath(`/tickets/${id}`);

    return { success: true, message: 'Ticket updated successfully' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update ticket';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Delete ticket
 */
export async function deleteTicketAction(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await getSessionUser();

    if (session && session.role === 'customer') {
      return { success: false, error: 'Customers do not have permission to delete tickets' };
    }

    await query(`DELETE FROM tickets WHERE id = $1;`, [id]);

    revalidatePath('/tickets');

    return { success: true, message: 'Ticket deleted successfully' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete ticket';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Add comment to a ticket
 */
export async function addCommentAction(
  ticketId: string,
  content: string
): Promise<ActionResponse<TicketComment>> {
  try {
    const session = await getSessionUser();

    if (!content || !content.trim()) {
      return { success: false, error: 'Comment content cannot be empty' };
    }

    const commentId = `cm-${Date.now().toString().slice(-6)}`;
    const authorName = session?.name || 'Support Team';
    const authorInitials = session?.initials || 'ST';
    const authorAvatar = session?.avatar || null;
    const authorId = session?.userId || null;

    const now = new Date();
    const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await query(
      `
      INSERT INTO comments (
        id, ticket_id, author_id, author_name, author_avatar,
        author_initials, content, timestamp_display, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW());
      `,
      [
        commentId,
        ticketId,
        authorId,
        authorName,
        authorAvatar,
        authorInitials,
        content.trim(),
        timeStr,
      ]
    );

    const comment: TicketComment = {
      id: commentId,
      authorName,
      authorAvatar: authorAvatar || undefined,
      authorInitials,
      content: content.trim(),
      timestamp: timeStr,
    };

    revalidatePath(`/tickets/${ticketId}`);

    return {
      success: true,
      message: 'Comment posted successfully',
      data: comment,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to post comment';
    return { success: false, error: message };
  }
}
