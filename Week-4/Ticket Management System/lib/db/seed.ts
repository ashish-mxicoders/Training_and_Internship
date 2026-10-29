// =====================================================================
// Database Seed Script
// This file populates the Neon PostgreSQL database with default data:
// 1. Admin Users (e.g., Jason, Annie) and Customer Users (e.g. Sarah)
// 2. All passwords are set to "123456" hashed with bcryptjs
// 3. Categories (Technical, Billing, Account, etc.)
// 4. Initial 20 Tickets with SLA, Priority, Status, and Comments
// =====================================================================

import bcrypt from 'bcryptjs';
import { query } from './db';
import { resetDatabaseSchema } from './schema';
import { INITIAL_TICKETS, TEAM_MEMBERS } from '../mock-data';

export async function seedDatabase() {
  console.log('--- Starting Database Seeding ---');

  // Step 1: Re-create all tables cleanly
  await resetDatabaseSchema();

  // Step 2: Hash the default password "123456"
  // User requirement: "seed k time sb ka password 123456 ka hash hi rhega customer ka admin ka sbka"
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('123456', salt);

  // Step 3: Insert Admin Users
  console.log('Inserting Admin Team Members...');
  for (const member of Object.values(TEAM_MEMBERS)) {
    await query(
      `
      INSERT INTO users (id, name, email, password_hash, role, avatar, initials, company)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING;
      `,
      [
        member.id,
        member.name,
        member.email,
        passwordHash,
        'admin',
        member.avatar || null,
        member.initials,
        'Acme Support Desk',
      ]
    );
  }

  // Also insert a generic admin user for easy testing
  await query(
    `
    INSERT INTO users (id, name, email, password_hash, role, avatar, initials, company)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO NOTHING;
    `,
    [
      'usr-admin-main',
      'System Administrator',
      'admin@acme.io',
      passwordHash,
      'admin',
      '/images/avatar-jason.jpg',
      'SA',
      'Acme Support Desk',
    ]
  );

  // Step 4: Insert Customer Users (from INITIAL_TICKETS)
  console.log('Inserting Customers...');
  const customerMap: Record<string, string> = {}; // email -> user_id

  // Add default demo customer
  const defaultCustomerId = 'cust-demo-1';
  await query(
    `
    INSERT INTO users (id, name, email, password_hash, role, avatar, initials, company)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (email) DO NOTHING;
    `,
    [
      defaultCustomerId,
      'Sarah Jenkins',
      'customer@client.com',
      passwordHash,
      'customer',
      null,
      'SJ',
      'Pine & Peak Inc.',
    ]
  );
  customerMap['customer@client.com'] = defaultCustomerId;

  let custCounter = 1;
  for (const t of INITIAL_TICKETS) {
    if (t.customer && t.customer.email && !customerMap[t.customer.email]) {
      const custId = `cust-${custCounter++}`;
      customerMap[t.customer.email] = custId;

      const initials = t.customer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      await query(
        `
        INSERT INTO users (id, name, email, password_hash, role, avatar, initials, company)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING;
        `,
        [
          custId,
          t.customer.name,
          t.customer.email,
          passwordHash,
          'customer',
          t.customer.avatar || null,
          initials || 'CU',
          t.customer.company,
        ]
      );
    }
  }

  // Step 5: Insert Categories
  console.log('Inserting Categories...');
  const defaultCategories = [
    { id: 'technical', name: 'Technical Issue' },
    { id: 'billing', name: 'Billing' },
    { id: 'account', name: 'Account & Login' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'access', name: 'Access' },
    { id: 'other', name: 'Other' },
  ];

  for (const cat of defaultCategories) {
    await query(
      `
      INSERT INTO categories (id, name)
      VALUES ($1, $2)
      ON CONFLICT (id) DO NOTHING;
      `,
      [cat.id, cat.name]
    );
  }

  // Step 6: Insert Tickets & Comments
  console.log('Inserting Initial Tickets...');
  for (const t of INITIAL_TICKETS) {
    const custId = t.customer?.email ? customerMap[t.customer.email] : defaultCustomerId;

    await query(
      `
      INSERT INTO tickets (
        id, subject, description, status, priority, category_id,
        channel, health, assignee_id, customer_id, customer_name,
        customer_company, customer_email, due_date,
        is_escalated, is_past_due, tags, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (id) DO NOTHING;
      `,
      [
        t.id,
        t.subject,
        t.description,
        t.status,
        t.priority,
        t.category,
        t.channel,
        t.health,
        t.assignee?.id || null,
        custId,
        t.customer.name,
        t.customer.company,
        t.customer.email,
        t.dueDate,
        t.isEscalated || false,
        t.isPastDue || false,
        t.tags || [],
        t.createdAt ? new Date(t.createdAt) : new Date(),
        t.updatedAt ? new Date(t.updatedAt) : new Date(),
      ]
    );

    // Insert comments for this ticket
    if (t.comments && t.comments.length > 0) {
      for (const c of t.comments) {
        await query(
          `
          INSERT INTO comments (
            id, ticket_id, author_id, author_name, author_avatar,
            author_initials, content, timestamp_display
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
          `,
          [
            c.id,
            t.id,
            t.assignee?.id || null,
            c.authorName,
            c.authorAvatar || null,
            c.authorInitials,
            c.content,
            c.timestamp,
          ]
        );
      }
    }
  }

  console.log('--- Database Seeding Completed Successfully! ---');
  return { success: true, message: 'Database seeded successfully with all initial tickets and users' };
}
