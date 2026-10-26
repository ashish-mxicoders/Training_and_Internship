// =====================================================================
// Direct Node.js Database Seeder Script
// Run directly using: node scripts/seed.cjs
// =====================================================================

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_zOpgH5WMEyT4@ep-old-cake-b4f4asqj-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runSeed() {
  console.log('Connecting to Neon PostgreSQL at:', connectionString.split('@')[1]);

  console.log('1. Dropping old tables...');
  await pool.query('DROP TABLE IF EXISTS comments CASCADE;');
  await pool.query('DROP TABLE IF EXISTS tickets CASCADE;');
  await pool.query('DROP TABLE IF EXISTS categories CASCADE;');
  await pool.query('DROP TABLE IF EXISTS users CASCADE;');

  console.log('2. Creating users table...');
  await pool.query(`
    CREATE TABLE users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
      avatar TEXT,
      initials VARCHAR(10) NOT NULL,
      company VARCHAR(150),
      tier VARCHAR(50) DEFAULT 'Enterprise',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('3. Creating categories table...');
  await pool.query(`
    CREATE TABLE categories (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('4. Creating tickets table...');
  await pool.query(`
    CREATE TABLE tickets (
      id VARCHAR(50) PRIMARY KEY,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
      priority VARCHAR(20) NOT NULL CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'todo')),
      category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
      channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'chat', 'slack', 'web')),
      health VARCHAR(20) NOT NULL CHECK (health IN ('on_track', 'warning', 'breached')),
      assignee_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
      customer_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
      customer_name VARCHAR(100),
      customer_company VARCHAR(150),
      customer_email VARCHAR(150),
      customer_tier VARCHAR(50) DEFAULT 'Enterprise',
      due_date VARCHAR(50) NOT NULL,
      is_escalated BOOLEAN DEFAULT FALSE,
      is_past_due BOOLEAN DEFAULT FALSE,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('5. Creating comments table...');
  await pool.query(`
    CREATE TABLE comments (
      id VARCHAR(50) PRIMARY KEY,
      ticket_id VARCHAR(50) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      author_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
      author_name VARCHAR(100) NOT NULL,
      author_avatar TEXT,
      author_initials VARCHAR(10) NOT NULL,
      is_internal BOOLEAN DEFAULT FALSE,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      timestamp_display VARCHAR(50) NOT NULL
    );
  `);

  // Default password "123456"
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('123456', salt);

  console.log('6. Inserting Admins...');
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
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, avatar, initials, company)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING;`,
      [a.id, a.name, a.email, passwordHash, a.role, a.avatar || null, a.initials, a.company]
    );
  }

  console.log('7. Inserting Customer Accounts...');
  const customers = [
    { id: 'cust-1', name: 'Sarah Jenkins', email: 'customer@client.com', initials: 'SJ', company: 'Pine & Peak Inc.' },
    { id: 'cust-2', name: 'Marcus Vance', email: 'm.vance@vancetech.io', initials: 'MV', company: 'Vance Logic' },
    { id: 'cust-3', name: 'Elena Rostova', email: 'elena@novasystems.de', initials: 'ER', company: 'Nova Systems' },
    { id: 'cust-4', name: 'Brian Thorne', email: 'brian@sentinelguard.com', initials: 'BT', company: 'Sentinel Guard' },
    { id: 'cust-5', name: 'Aaliyah Patel', email: 'aaliyah@crestline.org', initials: 'AP', company: 'Crestline Corp' },
  ];

  for (const c of customers) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, avatar, initials, company)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING;`,
      [c.id, c.name, c.email, passwordHash, 'customer', null, c.initials, c.company]
    );
  }

  console.log('8. Inserting Categories...');
  const categories = [
    { id: 'technical', name: 'Technical Issue' },
    { id: 'billing', name: 'Billing' },
    { id: 'account', name: 'Account & Login' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'access', name: 'Access' },
    { id: 'other', name: 'Other' },
  ];

  for (const cat of categories) {
    await pool.query(
      `INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING;`,
      [cat.id, cat.name]
    );
  }

  console.log('9. Inserting 20 Sample Tickets...');
  const sampleTickets = [
    { id: '#-001', subject: 'Low activation in week-one onboarding cohort for Pine & Peak', description: 'During the first week of onboarding for Pine & Peak, user activation is stalling around 22%. IdP sync logs show intermittent 401 callbacks.', status: 'open', priority: 'high', category: 'technical', channel: 'email', health: 'warning', assignee_id: 'usr-1', customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', customer_tier: 'Enterprise', due_date: '2026-10-31', is_escalated: false, is_past_due: false, tags: ['ENTERPRISE', 'ONBOARDING', 'IDP'] },
    { id: '#-002', subject: 'Expansion review blocked by delayed Salesforce health sync', description: 'Account expansion is pending review. Daily bidirectional health scores from Salesforce are lagging by 36 hours.', status: 'open', priority: 'high', category: 'billing', channel: 'chat', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', customer_tier: 'Enterprise', due_date: '2026-11-04', is_escalated: false, is_past_due: false, tags: ['SALESFORCE', 'SYNC', 'EXPANSION'] },
    { id: '#-003', subject: 'Need admin ownership model before enterprise rollout', description: 'Enterprise compliance team requires multi-owner governance and delegated admin roles before provisioning 1,500 seats.', status: 'pending', priority: 'high', category: 'account', channel: 'email', health: 'breached', assignee_id: 'usr-1', customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', customer_tier: 'Enterprise', due_date: '2026-10-24', is_escalated: true, is_past_due: true, tags: ['SECURITY', 'RBAC', 'ENTERPRISE'] },
    { id: '#-004', subject: 'Executive business review needs clearer API export guidance', description: 'VP of Engineering needs clarification on whether audit logs and raw activity feeds can be exported via public REST APIs.', status: 'open', priority: 'medium', category: 'technical', channel: 'web', health: 'on_track', assignee_id: 'usr-2', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', customer_tier: 'Enterprise', due_date: '2026-11-02', is_escalated: false, is_past_due: false, tags: ['API', 'AUDIT', 'EBR'] },
    { id: '#-005', subject: 'Renewal prep needs invoice usage breakdown by workspace', description: 'Procurement requested a detailed line-item invoice breaking down compute hours and storage allocation per sub-workspace.', status: 'open', priority: 'medium', category: 'billing', channel: 'email', health: 'warning', assignee_id: null, customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', customer_tier: 'Enterprise', due_date: '2026-10-29', is_escalated: false, is_past_due: false, tags: ['BILLING', 'INVOICE', 'RENEWAL'] },
    { id: '#-006', subject: 'Customer asks for a rollout plan for conditional workflows', description: 'Customer operations wants a sandbox dry-run for conditional approval chains prior to enabling production enforcement.', status: 'resolved', priority: 'low', category: 'other', channel: 'chat', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', customer_tier: 'Enterprise', due_date: '2026-10-22', is_escalated: false, is_past_due: false, tags: ['WORKFLOW', 'ROLLOUT', 'TRAINING'] },
    { id: '#-007', subject: 'Deactivate unused seats without closing the regional team restructure', description: 'Customer HR submitted a list of 24 departed contractor emails to revoke without modifying regional permissions.', status: 'closed', priority: 'todo', category: 'subscription', channel: 'web', health: 'on_track', assignee_id: 'usr-5', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', customer_tier: 'Growth', due_date: '2026-10-18', is_escalated: false, is_past_due: false, tags: ['SEAT-MANAGEMENT', 'OFFBOARDING'] },
    { id: '#-008', subject: 'Customer cannot regenerate API key after role update', description: 'After changing role to Admin, the API keys settings page shows forbidden 403 error on POST /api/keys/rotate.', status: 'open', priority: 'urgent', category: 'access', channel: 'chat', health: 'warning', assignee_id: null, customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', customer_tier: 'Enterprise', due_date: '2026-10-27', is_escalated: true, is_past_due: false, tags: ['ACCESS', 'API', 'URGENT'] },
    { id: '#-009', subject: 'CSV import adoption stalled for the multilingual customer base', description: 'Users in Tokyo and Berlin report encoding errors with UTF-8 character sets when importing customer lists via CSV.', status: 'pending', priority: 'urgent', category: 'technical', channel: 'email', health: 'warning', assignee_id: 'usr-3', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', customer_tier: 'Enterprise', due_date: '2026-10-28', is_escalated: false, is_past_due: false, tags: ['CSV', 'I18N', 'IMPORT'] },
    { id: '#-010', subject: 'Need a structured training deck for internal frontline agents', description: 'Support manager asked for an onboarding slide deck with screenshots of the new SLA rules and ticket routing flow.', status: 'resolved', priority: 'low', category: 'other', channel: 'email', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', customer_tier: 'Growth', due_date: '2026-10-20', is_escalated: false, is_past_due: false, tags: ['TRAINING', 'DOCUMENTATION'] },
    { id: '#-011', subject: 'Finance review asks for invoice split by cost center', description: 'Finance controller requires monthly billing broken down by Cost Center 104 and 209 instead of a unified single charge.', status: 'pending', priority: 'medium', category: 'billing', channel: 'email', health: 'warning', assignee_id: 'usr-4', customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', customer_tier: 'Enterprise', due_date: '2026-10-30', is_escalated: false, is_past_due: false, tags: ['FINANCE', 'BILLING', 'COST-CENTER'] },
    { id: '#-012', subject: 'Mobile app push notifications missing after latest update', description: 'iOS users on version 3.4.1 are no longer receiving push alerts when tickets are assigned or commented on.', status: 'open', priority: 'urgent', category: 'technical', channel: 'slack', health: 'breached', assignee_id: 'usr-1', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', customer_tier: 'Enterprise', due_date: '2026-10-25', is_escalated: true, is_past_due: true, tags: ['MOBILE', 'IOS', 'NOTIFICATIONS'] },
    { id: '#-013', subject: 'Verify compliance documentation for SOC2 Type II audit', description: 'Audit team requested updated encryption at rest certificates and third-party penetration test executive summary.', status: 'resolved', priority: 'high', category: 'access', channel: 'web', health: 'on_track', assignee_id: 'usr-7', customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', customer_tier: 'Enterprise', due_date: '2026-10-23', is_escalated: false, is_past_due: false, tags: ['COMPLIANCE', 'SOC2', 'SECURITY'] },
    { id: '#-014', subject: 'SLA breach report export has timezone mismatch', description: 'The CSV export outputs timestamps in UTC instead of the configured workspace timezone (America/New_York).', status: 'open', priority: 'high', category: 'technical', channel: 'email', health: 'warning', assignee_id: 'usr-6', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', customer_tier: 'Enterprise', due_date: '2026-10-31', is_escalated: false, is_past_due: false, tags: ['SLA', 'REPORTING', 'TIMEZONE'] },
    { id: '#-015', subject: 'Plan phased seat expansion for the next quarter launch', description: 'Client plans to add 400 seats over Q1. Requests staging schedule, volume tier pricing confirmation, and dedicated TAM.', status: 'pending', priority: 'medium', category: 'subscription', channel: 'slack', health: 'on_track', assignee_id: 'usr-5', customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', customer_tier: 'Enterprise', due_date: '2026-11-05', is_escalated: false, is_past_due: false, tags: ['EXPANSION', 'QUARTERLY', 'SEATS'] },
    { id: '#-016', subject: 'Cannot verify ownership after domain migration', description: 'Domain changed from oldbrand.co to newbrand.com. DNS TXT record check fails with nxdomain error.', status: 'open', priority: 'high', category: 'technical', channel: 'chat', health: 'breached', assignee_id: null, customer_id: 'cust-1', customer_name: 'Sarah Jenkins', customer_company: 'Pine & Peak', customer_email: 'sarah.j@pinepeak.com', customer_tier: 'Enterprise', due_date: '2026-10-26', is_escalated: true, is_past_due: false, tags: ['DNS', 'DOMAIN', 'VERIFICATION'] },
    { id: '#-017', subject: 'Broken help article link is slowing onboarding conversion', description: 'Link to "Configuring SAML 2.0 with Okta" in the onboarding checklist redirects to a 404 page.', status: 'closed', priority: 'low', category: 'other', channel: 'web', health: 'on_track', assignee_id: 'usr-3', customer_id: 'cust-2', customer_name: 'Marcus Vance', customer_company: 'Vance Logic', customer_email: 'm.vance@vancetech.io', customer_tier: 'Growth', due_date: '2026-10-15', is_escalated: false, is_past_due: false, tags: ['DOCS', 'LINKS', 'ONBOARDING'] },
    { id: '#-018', subject: 'Webhook delivery delays to our Salesforce endpoint', description: 'Outbound webhooks for ticket status changes are queued with delays exceeding 8 minutes during peak hours.', status: 'open', priority: 'urgent', category: 'technical', channel: 'slack', health: 'on_track', assignee_id: 'usr-1', customer_id: 'cust-3', customer_name: 'Elena Rostova', customer_company: 'Nova Systems', customer_email: 'elena@novasystems.de', customer_tier: 'Enterprise', due_date: '2026-10-29', is_escalated: true, is_past_due: false, tags: ['WEBHOOKS', 'SALESFORCE', 'PERFORMANCE'] },
    { id: '#-019', subject: 'Annual subscription renewal discount approval needed', description: 'Account executive has requested VP approval for a 15% multi-year discount commitment for Nova Systems.', status: 'resolved', priority: 'medium', category: 'subscription', channel: 'email', health: 'on_track', assignee_id: 'usr-4', customer_id: 'cust-4', customer_name: 'Brian Thorne', customer_company: 'Sentinel Guard', customer_email: 'brian@sentinelguard.com', customer_tier: 'Enterprise', due_date: '2026-10-21', is_escalated: false, is_past_due: false, tags: ['DISCOUNT', 'RENEWAL', 'APPROVAL'] },
    { id: '#-020', subject: 'VAT breakdown per region is needed for the renewal review', description: 'European tax authorities requested cross-border VAT reconciliation for Germany and Ireland entities.', status: 'closed', priority: 'low', category: 'billing', channel: 'email', health: 'on_track', assignee_id: 'usr-4', customer_id: 'cust-5', customer_name: 'Aaliyah Patel', customer_company: 'Crestline Corp', customer_email: 'aaliyah@crestline.org', customer_tier: 'Enterprise', due_date: '2026-10-19', is_escalated: false, is_past_due: false, tags: ['TAX', 'VAT', 'EUROPE'] },
  ];

  for (const t of sampleTickets) {
    await pool.query(
      `INSERT INTO tickets (
        id, subject, description, status, priority, category_id,
        channel, health, assignee_id, customer_id, customer_name,
        customer_company, customer_email, customer_tier, due_date,
        is_escalated, is_past_due, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (id) DO NOTHING;`,
      [
        t.id, t.subject, t.description, t.status, t.priority, t.category,
        t.channel, t.health, t.assignee_id, t.customer_id, t.customer_name,
        t.customer_company, t.customer_email, t.customer_tier, t.due_date,
        t.is_escalated, t.is_past_due, t.tags
      ]
    );
  }

  console.log('10. Inserting Sample Comments for #-001, #-002, #-003...');
  const sampleComments = [
    { id: 'com-1', ticket_id: '#-001', author_name: 'Sarah Jenkins', author_initials: 'SJ', content: 'We noticed the 401 callbacks starting around 9:30 AM EST right after the latest Okta policy sync.', timestamp_display: 'Today at 10:14 AM' },
    { id: 'com-2', ticket_id: '#-001', author_name: 'Jason Duong', author_initials: 'JD', content: 'Investigating now. I see the SAML assertion payload is missing the email claim attribute.', timestamp_display: 'Today at 10:35 AM' },
    { id: 'com-3', ticket_id: '#-003', author_name: 'Elena Rostova', author_initials: 'ER', content: 'Our security council cannot greenlight deployment until delegated permissions are enforced.', timestamp_display: 'Yesterday at 3:45 PM' },
    { id: 'com-4', ticket_id: '#-003', author_name: 'Jason Duong', author_initials: 'JD', content: 'Escalated to engineering leads. We have prepared an admin ownership staging build for your review.', timestamp_display: 'Today at 9:15 AM' },
  ];

  for (const cm of sampleComments) {
    await pool.query(
      `INSERT INTO comments (id, ticket_id, author_name, author_initials, is_internal, content, timestamp_display)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING;`,
      [cm.id, cm.ticket_id, cm.author_name, cm.author_initials, false, cm.content, cm.timestamp_display]
    );
  }

  console.log('--- SEEDING COMPLETED SUCCESSFULLY! ---');
  await pool.end();
}

runSeed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
