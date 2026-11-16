'use server';

// =====================================================================
// Next.js Server Actions: Ticket Operations
// Powered by Modern Prisma 7 ORM
// =====================================================================

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
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

    // Determine sequential numerical ID (e.g. '1', '2', ..., '21')
    const allTickets = await prisma.ticket.findMany({
      select: { id: true },
    });
    let maxNum = 0;
    for (const r of allTickets) {
      const n = parseInt(String(r.id).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
    const newId = String(maxNum + 1);

    const finalCustomerName = session?.name || customerName || 'New Client';
    const finalCompanyName = session?.company || companyName || 'Independent';
    const finalCustomerEmail = session?.email || customerEmail || 'client@example.com';
    const finalCustomerId = session?.userId || null;

    // Create ticket via modern Prisma ORM
    const createdTicket = await prisma.ticket.create({
      data: {
        id: newId,
        subject: subject.trim(),
        description: description?.trim() || '',
        status: status as any,
        priority: priority as any,
        categoryId: category,
        channel: channel as any,
        health: health as any,
        assigneeId: assigneeId || null,
        customerId: finalCustomerId,
        customerName: finalCustomerName,
        customerCompany: finalCompanyName,
        customerEmail: finalCustomerEmail,
        dueDate: dueDate || '',
        isEscalated: Boolean(isEscalated),
        isPastDue: false,
        tags: tags || [],
      },
      include: {
        assignee: true,
      },
    });

    const newTicket: Ticket = {
      id: createdTicket.id,
      subject: createdTicket.subject,
      description: createdTicket.description,
      status: createdTicket.status as TicketStatus,
      priority: createdTicket.priority as any,
      category: (createdTicket.categoryId || 'other') as any,
      channel: createdTicket.channel as any,
      health: createdTicket.health as any,
      dueDate: createdTicket.dueDate || '',
      isEscalated: createdTicket.isEscalated ?? false,
      isPastDue: false,
      tags: createdTicket.tags || [],
      createdAt: createdTicket.createdAt
        ? new Date(createdTicket.createdAt).toISOString().split('T')[0]
        : '',
      updatedAt: createdTicket.updatedAt
        ? new Date(createdTicket.updatedAt).toISOString().split('T')[0]
        : '',
      assignee: createdTicket.assignee
        ? {
            id: createdTicket.assignee.id,
            name: createdTicket.assignee.name,
            email: createdTicket.assignee.email,
            initials: createdTicket.assignee.initials,
            avatar: createdTicket.assignee.avatar || undefined,
            role: createdTicket.assignee.role,
          }
        : undefined,
      customer: {
        name: createdTicket.customerName || 'Client',
        company: createdTicket.customerCompany || 'Independent',
        email: createdTicket.customerEmail || 'client@example.com',
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

    await prisma.ticket.update({
      where: { id },
      data: { status: status as any },
    });

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

    const dataToUpdate: any = {};

    if (updates.status !== undefined) dataToUpdate.status = updates.status;
    if (updates.priority !== undefined) dataToUpdate.priority = updates.priority;
    if (updates.health !== undefined) dataToUpdate.health = updates.health;

    const targetAssigneeId =
      updates.assigneeId !== undefined
        ? updates.assigneeId
        : updates.assignee !== undefined
        ? updates.assignee?.id || null
        : undefined;

    if (targetAssigneeId !== undefined) {
      dataToUpdate.assigneeId = targetAssigneeId || null;
    }
    if (updates.isEscalated !== undefined) {
      dataToUpdate.isEscalated = Boolean(updates.isEscalated);
    }
    if (updates.subject !== undefined) dataToUpdate.subject = updates.subject;
    if (updates.description !== undefined) dataToUpdate.description = updates.description;
    if (updates.dueDate !== undefined) dataToUpdate.dueDate = updates.dueDate;

    if (Object.keys(dataToUpdate).length === 0) {
      return { success: true, message: 'No fields to update' };
    }

    await prisma.ticket.update({
      where: { id },
      data: dataToUpdate,
    });

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

    await prisma.ticket.delete({
      where: { id },
    });

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

    await prisma.comment.create({
      data: {
        id: commentId,
        ticketId: ticketId,
        authorId: authorId,
        authorName: authorName,
        authorAvatar: authorAvatar,
        authorInitials: authorInitials,
        content: content.trim(),
        timestampDisplay: timeStr,
      },
    });

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
