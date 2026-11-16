'use client';

// =====================================================================
// Ticket Detail Page: /tickets/[id]
// Clean, component-based orchestrator utilizing Next.js Dynamic Routes.
// =====================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketPriority, TicketStatus } from '@/types';
import { ConfirmModal } from '@/components/ui/CustomModal';
import { TEAM_MEMBERS } from '@/lib/mock-data';
import { TicketDetailHeader } from '@/components/tickets/detail/TicketDetailHeader';
import { TicketDetailConversation } from '@/components/tickets/detail/TicketDetailConversation';
import { TicketDetailSidebar } from '@/components/tickets/detail/TicketDetailSidebar';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tickets, updateTicketStatus, updateTicket, addComment, deleteTicket, currentUser } = useTickets();

  const ticketId = params.id as string;
  const ticket = tickets.find((t) => t.id === ticketId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!ticket) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          Ticket Not Found
        </h2>
        <p className="text-sm text-zinc-500">
          The requested ticket ID does not exist or was deleted.
        </p>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </Link>
      </div>
    );
  }

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    await deleteTicket(ticket.id);
    router.push('/tickets');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Detail Header (Breadcrumbs, title, status action buttons) */}
      <TicketDetailHeader
        ticket={ticket}
        currentUser={currentUser}
        onToggleResolved={() =>
          updateTicketStatus(ticket.id, ticket.status === 'resolved' ? 'open' : 'resolved')
        }
        onRequestDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description, Conversation Thread & Reply Box */}
        <div className="lg:col-span-2">
          <TicketDetailConversation
            ticket={ticket}
            onPostComment={(content) => addComment(ticket.id, content)}
          />
        </div>

        {/* Right Column: Properties, SLA countdown & Customer Profile */}
        <div>
          <TicketDetailSidebar
            ticket={ticket}
            onUpdateStatus={(status, isEscalated) =>
              updateTicket(ticket.id, {
                status,
                isEscalated: isEscalated ?? ticket.isEscalated,
              })
            }
            onUpdatePriority={(priority: TicketPriority) =>
              updateTicket(ticket.id, { priority })
            }
            onUpdateAssignee={(assigneeId: string) => {
              const member = Object.values(TEAM_MEMBERS).find((m) => m.id === assigneeId);
              updateTicket(ticket.id, { assigneeId: member ? member.id : null });
            }}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Ticket"
        message={`Are you sure you want to permanently delete ticket #${ticket.id}? This action cannot be undone.`}
        confirmText="Delete Ticket"
        cancelText="Keep Ticket"
        isDestructive={true}
      />
    </div>
  );
}
