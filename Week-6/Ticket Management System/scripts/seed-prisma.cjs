// =====================================================================
// Direct Node.js Database Seeder Script using Modern Prisma 7 ORM
// Run directly using: node scripts/seed-prisma.cjs
// =====================================================================

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function runSeed() {
  console.log('Connecting to Neon PostgreSQL via Prisma 7 Client with PG Driver Adapter...');

  console.log('1. Cleaning existing data...');
  await prisma.comment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('2. Hashing default password (123456)...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('123456', salt);

  console.log('3. Inserting Admins...');
  const admins = [
    { id: 'usr-1', name: 'Jason Duong', email: 'jason.duong@acme.io', initials: 'JD', avatar: '/images/avatar-jason.jpg', role: 'admin', company: 'Acme Support' },
    { id: 'usr-2', name: 'Annie Nguyen', email: 'annie.nguyen@acme.io', initials: 'AN', avatar: '/images/avatar-annie.jpg', role: 'admin', company: 'Acme Support' },
    { id: 'usr-3', name: 'Nhi Pham', email: 'nhi.pham@acme.io', initials: 'NP', role: 'admin', company: 'Acme Support' },
    { id: 'usr-4', name: 'Thanh Le', email: 'thanh.le@acme.io', initials: 'TL', role: 'admin', company: 'Acme Support' },
    { id: 'usr-5', name: 'Lam Tran', email: 'lam.tran@acme.io', initials: 'LT', role: 'admin', company: 'Acme Support' },
    { id: 'usr-6', name: 'Bao Truong', email: 'bao.truong@acme.io', initials: 'BT', role: 'admin', company: 'Acme Support' },
    { id: 'usr-7', name: 'Michael Huang', email: 'michael.huang@acme.io', initials: 'MH', role: 'admin', company: 'Acme Support' },
    { id: 'usr-admin-main', name: 'Admin User', email: 'admin@acme.io', initials: 'AU', avatar: '/images/avatar-jason.jpg', role: 'admin', company: 'Acme Support' },
  ];

  for (const a of admins) {
    await prisma.user.create({
      data: {
        id: a.id,
        name: a.name,
        email: a.email,
        passwordHash: passwordHash,
        role: a.role,
        avatar: a.avatar || null,
        initials: a.initials,
        company: a.company,
      },
    });
  }

  console.log('4. Inserting Customer Accounts...');
  const customers = [
    { id: 'cust-1', name: 'Sarah Jenkins', email: 'customer@client.com', initials: 'SJ', company: 'Pine & Peak Inc.' },
    { id: 'cust-2', name: 'Marcus Vance', email: 'm.vance@vancetech.io', initials: 'MV', company: 'Vance Logic' },
    { id: 'cust-3', name: 'Elena Rostova', email: 'elena@novasystems.de', initials: 'ER', company: 'Nova Systems' },
    { id: 'cust-4', name: 'Brian Thorne', email: 'brian@sentinelguard.com', initials: 'BT', company: 'Sentinel Guard' },
    { id: 'cust-5', name: 'Aaliyah Patel', email: 'aaliyah@crestline.org', initials: 'AP', company: 'Crestline Corp' },
  ];

  for (const c of customers) {
    await prisma.user.create({
      data: {
        id: c.id,
        name: c.name,
        email: c.email,
        passwordHash: passwordHash,
        role: 'customer',
        avatar: null,
        initials: c.initials,
        company: c.company,
      },
    });
  }

  console.log('5. Inserting Categories...');
  const categories = [
    { id: 'technical', name: 'Technical Issue' },
    { id: 'billing', name: 'Billing' },
    { id: 'account', name: 'Account & Login' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'access', name: 'Access' },
    { id: 'other', name: 'Other' },
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
      },
    });
  }

  console.log('6. Inserting 20 Sample Tickets...');
  const sampleTickets = [
    { id: '1', subject: 'Low activation in week-one onboarding cohort for Pine & Peak', description: 'During the first week of onboarding for Pine & Peak, user activation is stalling around 22%. IdP sync logs show intermittent 401 callbacks.', status: 'open', priority: 'high', category_id: 'technical', channel: 'email', health: 'warning', assignee_id: 'usr-1', customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', due_date: '2026-10-31', is_escalated: false, is_past_due: false, tags: ['ONBOARDING', 'IDP'] },
    { id: '2', subject: 'Expansion review blocked by delayed Salesforce health sync', description: 'Account expansion is pending review. Daily bidirectional health scores from Salesforce are lagging by 36 hours.', status: 'open', priority: 'high', category_id: 'billing', channel: 'chat', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', due_date: '2026-11-04', is_escalated: false, is_past_due: false, tags: ['SALESFORCE', 'SYNC', 'EXPANSION'] },
    { id: '3', subject: 'Need admin ownership model before enterprise rollout', description: 'Enterprise compliance team requires multi-owner governance and delegated admin roles before provisioning 1,500 seats.', status: 'pending', priority: 'high', category: 'account', channel: 'email', health: 'breached', assignee_id: 'usr-1', customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', due_date: '2026-10-24', is_escalated: true, is_past_due: true, tags: ['SECURITY', 'RBAC'] },
    { id: '4', subject: 'Executive business review needs clearer API export guidance', description: 'VP of Engineering needs clarification on whether audit logs and raw activity feeds can be exported via public REST APIs.', status: 'open', priority: 'medium', category: 'technical', channel: 'web', health: 'on_track', assignee_id: 'usr-2', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', due_date: '2026-11-02', is_escalated: false, is_past_due: false, tags: ['API', 'AUDIT', 'EBR'] },
    { id: '5', subject: 'Renewal prep needs invoice usage breakdown by workspace', description: 'Procurement requested a detailed line-item invoice breaking down compute hours and storage allocation per sub-workspace.', status: 'open', priority: 'medium', category: 'billing', channel: 'email', health: 'warning', assignee_id: null, customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', due_date: '2026-10-29', is_escalated: false, is_past_due: false, tags: ['BILLING', 'INVOICE', 'RENEWAL'] },
    { id: '6', subject: 'Customer asks for a rollout plan for conditional workflows', description: 'Customer operations wants a sandbox dry-run for conditional approval chains prior to enabling production enforcement.', status: 'resolved', priority: 'low', category: 'other', channel: 'chat', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', due_date: '2026-10-22', is_escalated: false, is_past_due: false, tags: ['WORKFLOW', 'ROLLOUT', 'TRAINING'] },
    { id: '7', subject: 'Deactivate unused seats without closing the regional team restructure', description: 'Customer HR submitted a list of 24 departed contractor emails to revoke without modifying regional permissions.', status: 'closed', priority: 'todo', category: 'subscription', channel: 'web', health: 'on_track', assignee_id: 'usr-5', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', due_date: '2026-10-18', is_escalated: false, is_past_due: false, tags: ['SEAT-MANAGEMENT', 'OFFBOARDING'] },
    { id: '8', subject: 'Customer cannot regenerate API key after role update', description: 'After changing role to Admin, the API keys settings page shows forbidden 403 error on POST /api/keys/rotate.', status: 'open', priority: 'urgent', category: 'access', channel: 'chat', health: 'warning', assignee_id: null, customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', due_date: '2026-10-27', is_escalated: true, is_past_due: false, tags: ['ACCESS', 'API', 'URGENT'] },
    { id: '9', subject: 'CSV import adoption stalled for the multilingual customer base', description: 'Users in Tokyo and Berlin report encoding errors with UTF-8 character sets when importing customer lists via CSV.', status: 'pending', priority: 'urgent', category: 'technical', channel: 'email', health: 'warning', assignee_id: 'usr-3', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', due_date: '2026-10-28', is_escalated: false, is_past_due: false, tags: ['CSV', 'I18N', 'IMPORT'] },
    { id: '10', subject: 'Need a structured training deck for internal frontline agents', description: 'Support manager asked for an onboarding slide deck with screenshots of the new SLA rules and ticket routing flow.', status: 'resolved', priority: 'low', category: 'other', channel: 'email', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', due_date: '2026-10-20', is_escalated: false, is_past_due: false, tags: ['TRAINING', 'DOCUMENTATION'] },
    { id: '11', subject: 'Finance review asks for invoice split by cost center', description: 'Finance controller requires monthly billing broken down by Cost Center 104 and 209 instead of a unified single charge.', status: 'pending', priority: 'medium', category: 'billing', channel: 'email', health: 'warning', assignee_id: 'usr-4', customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', due_date: '2026-10-30', is_escalated: false, is_past_due: false, tags: ['FINANCE', 'BILLING', 'COST-CENTER'] },
    { id: '12', subject: 'Mobile app push notifications missing after latest update', description: 'iOS users on version 3.4.1 are no longer receiving push alerts when tickets are assigned or commented on.', status: 'open', priority: 'urgent', category: 'technical', channel: 'slack', health: 'breached', assignee_id: 'usr-1', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', due_date: '2026-10-25', is_escalated: true, is_past_due: true, tags: ['MOBILE', 'IOS', 'NOTIFICATIONS'] },
    { id: '13', subject: 'Verify compliance documentation for SOC2 Type II audit', description: 'Audit team requested updated encryption at rest certificates and third-party penetration test executive summary.', status: 'resolved', priority: 'high', category: 'access', channel: 'web', health: 'on_track', assignee_id: 'usr-7', customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', due_date: '2026-10-23', is_escalated: false, is_past_due: false, tags: ['COMPLIANCE', 'SOC2', 'SECURITY'] },
    { id: '14', subject: 'SLA breach report export has timezone mismatch', description: 'The CSV export outputs timestamps in UTC instead of the configured workspace timezone (America/New_York).', status: 'open', priority: 'high', category: 'technical', channel: 'email', health: 'warning', assignee_id: 'usr-6', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', due_date: '2026-10-31', is_escalated: false, is_past_due: false, tags: ['SLA', 'REPORTING', 'TIMEZONE'] },
    { id: '15', subject: 'Plan phased seat expansion for the next quarter launch', description: 'Client plans to add 400 seats over Q1. Requests staging schedule, volume tier pricing confirmation, and dedicated TAM.', status: 'pending', priority: 'medium', category: 'subscription', channel: 'slack', health: 'on_track', assignee_id: 'usr-5', customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', due_date: '2026-11-05', is_escalated: false, is_past_due: false, tags: ['EXPANSION', 'QUARTERLY', 'SEATS'] },
    { id: '16', subject: 'Cannot verify ownership after domain migration', description: 'Domain changed from oldbrand.co to newbrand.com. DNS TXT record check fails with nxdomain error.', status: 'open', priority: 'high', category: 'technical', channel: 'chat', health: 'breached', assignee_id: null, customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', due_date: '2026-10-26', is_escalated: true, is_past_due: false, tags: ['DNS', 'DOMAIN', 'VERIFICATION'] },
    { id: '17', subject: 'Broken help article link is slowing onboarding conversion', description: 'Link to "Configuring SAML 2.0 with Okta" in the onboarding checklist redirects to a 404 page.', status: 'closed', priority: 'low', category: 'other', channel: 'web', health: 'on_track', assignee_id: 'usr-3', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', due_date: '2026-10-15', is_escalated: false, is_past_due: false, tags: ['DOCS', 'LINKS', 'ONBOARDING'] },
    { id: '18', subject: 'Webhook delivery delays to our Salesforce endpoint', description: 'Outbound webhooks for ticket status changes are queued with delays exceeding 8 minutes during peak hours.', status: 'open', priority: 'urgent', category: 'technical', channel: 'slack', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', due_date: '2026-10-29', is_escalated: true, is_past_due: false, tags: ['WEBHOOKS', 'SALESFORCE', 'PERFORMANCE'] },
    { id: '19', subject: 'Annual subscription renewal discount approval needed', description: 'Account executive has requested VP approval for a 15% multi-year discount commitment for Nova Systems.', status: 'resolved', priority: 'medium', category: 'subscription', channel: 'email', health: 'on_track', assignee_id: 'usr-4', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', due_date: '2026-10-21', is_escalated: false, is_past_due: false, tags: ['DISCOUNT', 'RENEWAL', 'APPROVAL'] },
    { id: '20', subject: 'VAT breakdown per region is needed for the renewal review', description: 'European tax authorities requested cross-border VAT reconciliation for Germany and Ireland entities.', status: 'closed', priority: 'low', category: 'billing', channel: 'email', health: 'on_track', assignee_id: 'usr-4', customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', due_date: '2026-10-19', is_escalated: false, is_past_due: false, tags: ['TAX', 'VAT', 'EUROPE'] },
  ];

  for (const t of sampleTickets) {
    await prisma.ticket.create({
      data: {
        id: t.id,
        subject: t.subject,
        description: t.description,
        status: t.status,
        priority: t.priority,
        categoryId: t.category_id,
        channel: t.channel,
        health: t.health,
        assigneeId: t.assignee_id,
        customerId: t.customer_id,
        customerName: t.customer_name,
        customerCompany: t.customer_company,
        customerEmail: t.customer_email,
        dueDate: t.due_date,
        isEscalated: t.is_escalated,
        isPastDue: t.is_past_due,
        tags: t.tags,
      },
    });
  }

  console.log('7. Inserting Sample Comments...');
  const sampleComments = [
    { id: 'com-1', ticketId: '1', authorName: 'Sarah Jenkins', authorInitials: 'SJ', content: 'We noticed the 401 callbacks starting around 9:30 AM EST right after the latest Okta policy sync.', timestampDisplay: 'Today at 10:14 AM' },
    { id: 'com-2', ticketId: '1', authorName: 'Jason Duong', authorInitials: 'JD', content: 'Investigating now. I see the SAML assertion payload is missing the email claim attribute.', timestampDisplay: 'Today at 10:35 AM' },
    { id: 'com-3', ticketId: '3', authorName: 'Elena Rostova', authorInitials: 'ER', content: 'Our security council cannot greenlight deployment until delegated permissions are enforced.', timestampDisplay: 'Yesterday at 3:45 PM' },
    { id: 'com-4', ticketId: '3', authorName: 'Jason Duong', authorInitials: 'JD', content: 'Escalated to engineering leads. We have prepared an admin ownership staging build for your review.', timestampDisplay: 'Today at 9:15 AM' },
  ];

  for (const cm of sampleComments) {
    await prisma.comment.create({
      data: {
        id: cm.id,
        ticketId: cm.ticketId,
        authorName: cm.authorName,
        authorInitials: cm.authorInitials,
        content: cm.content,
        timestampDisplay: cm.timestampDisplay,
      },
    });
  }

  console.log('--- MODERN PRISMA 7 SEEDING COMPLETED SUCCESSFULLY! ---');
  await pool.end();
}

runSeed().catch(async (err) => {
  console.error('Seeding failed:', err);
  await pool.end();
  process.exit(1);
});
