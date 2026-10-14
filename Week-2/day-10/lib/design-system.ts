import { TicketCategory, TicketChannel, TicketHealth, TicketPriority, TicketStatus } from '@/types/ticket';

export const DESIGN_TOKENS = {
  colors: {
    brand: {
      yellow: '#F59E0B',
      yellowHover: '#D97706',
      yellowLight: '#FEF3C7',
      yellowDark: '#78350F',
    },
    status: {
      open: {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800/50',
        dot: 'bg-blue-600',
        label: 'Open',
      },
      pending: {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800/50',
        dot: 'bg-amber-500',
        label: 'Pending',
      },
      resolved: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800/50',
        dot: 'bg-emerald-500',
        label: 'Resolved',
      },
      closed: {
        bg: 'bg-zinc-100 dark:bg-zinc-800/60',
        text: 'text-zinc-700 dark:text-zinc-300',
        border: 'border-zinc-200 dark:border-zinc-700/60',
        dot: 'bg-zinc-400',
        label: 'Closed',
      },
    },
    health: {
      on_track: {
        bg: 'bg-zinc-100 dark:bg-zinc-800',
        text: 'text-zinc-700 dark:text-zinc-300',
        border: 'border-zinc-200 dark:border-zinc-700',
        dot: 'bg-zinc-500 dark:bg-zinc-400',
        label: 'On Track',
      },
      warning: {
        bg: 'bg-[#FEF7EC] dark:bg-amber-950/30',
        text: 'text-[#B54708] dark:text-amber-300',
        border: 'border-[#FEDF89] dark:border-amber-800/40',
        dot: 'bg-[#F79009]',
        label: 'Warning',
      },
      breached: {
        bg: 'bg-[#FEF3F2] dark:bg-rose-950/30',
        text: 'text-[#B42318] dark:text-rose-300',
        border: 'border-[#FECDCA] dark:border-rose-800/40',
        dot: 'bg-[#F04438]',
        label: 'Breached',
      },
    },
    priority: {
      urgent: {
        color: 'text-rose-600 dark:text-rose-400',
        symbol: '↑',
        label: 'Urgent',
      },
      high: {
        color: 'text-amber-600 dark:text-amber-400',
        symbol: '↑',
        label: 'High',
      },
      medium: {
        color: 'text-sky-600 dark:text-sky-400',
        symbol: '—',
        label: 'Medium',
      },
      low: {
        color: 'text-zinc-500 dark:text-zinc-400',
        symbol: '↓',
        label: 'Low',
      },
      todo: {
        color: 'text-zinc-400 dark:text-zinc-500',
        symbol: '○',
        label: 'Todo',
      },
    },
  },
} as const;

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  billing: 'Billing',
  technical: 'Technical Issue',
  account: 'Account & Login',
  subscription: 'Subscription',
  other: 'Other',
  access: 'Access',
};

export const CHANNEL_LABELS: Record<TicketChannel, string> = {
  email: 'Email',
  chat: 'Chat',
  slack: 'Slack',
  web: 'Web',
};
