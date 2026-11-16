// =====================================================================
// Database Seed Script
// Powered by Modern Prisma 7 ORM
// Populates Neon PostgreSQL database with default data:
// 1. Admin Users (e.g. Jason, Annie) and Customer Users (e.g. Sarah)
// 2. All passwords set to "123456" hashed with bcryptjs
// 3. Categories (Technical, Billing, Account, etc.)
// 4. Initial 20 Tickets with SLA, Priority, Status, and Comments
// =====================================================================

import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { INITIAL_TICKETS, TEAM_MEMBERS } from '../mock-data';

export async function seedDatabase() {
  console.log('--- Starting Database Seeding with Modern Prisma 7 ORM ---');

  // Step 1: Clean all existing records in reverse dependency order
  await prisma.comment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Step 2: Hash the default password "123456"
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('123456', salt);

  // Step 3: Insert Admin Users
  console.log('Inserting Admin Team Members...');
  for (const member of Object.values(TEAM_MEMBERS)) {
    await prisma.user.upsert({
      where: { id: member.id },
      update: {
        name: member.name,
        email: member.email,
        passwordHash: passwordHash,
        role: 'admin',
        avatar: member.avatar || null,
        initials: member.initials,
        company: 'Acme Support Desk',
      },
      create: {
        id: member.id,
        name: member.name,
        email: member.email,
        passwordHash: passwordHash,
        role: 'admin',
        avatar: member.avatar || null,
        initials: member.initials,
        company: 'Acme Support Desk',
      },
    });
  }

  // Also insert a generic admin user for easy testing
  await prisma.user.upsert({
    where: { id: 'usr-admin-main' },
    update: {
      name: 'System Administrator',
      email: 'admin@acme.io',
      passwordHash: passwordHash,
      role: 'admin',
      avatar: '/images/avatar-jason.jpg',
      initials: 'SA',
      company: 'Acme Support Desk',
    },
    create: {
      id: 'usr-admin-main',
      name: 'System Administrator',
      email: 'admin@acme.io',
      passwordHash: passwordHash,
      role: 'admin',
      avatar: '/images/avatar-jason.jpg',
      initials: 'SA',
      company: 'Acme Support Desk',
    },
  });

  // Step 4: Insert Customer Users (from INITIAL_TICKETS)
  console.log('Inserting Customers...');
  const customerMap: Record<string, string> = {}; // email -> user_id

  // Add default demo customer
  const defaultCustomerId = 'cust-demo-1';
  await prisma.user.upsert({
    where: { email: 'customer@client.com' },
    update: {
      name: 'Sarah Jenkins',
      passwordHash: passwordHash,
      role: 'customer',
      avatar: null,
      initials: 'SJ',
      company: 'Pine & Peak Inc.',
    },
    create: {
      id: defaultCustomerId,
      name: 'Sarah Jenkins',
      email: 'customer@client.com',
      passwordHash: passwordHash,
      role: 'customer',
      avatar: null,
      initials: 'SJ',
      company: 'Pine & Peak Inc.',
    },
  });
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

      await prisma.user.upsert({
        where: { email: t.customer.email },
        update: {
          name: t.customer.name,
          passwordHash: passwordHash,
          role: 'customer',
          avatar: t.customer.avatar || null,
          initials: initials || 'CU',
          company: t.customer.company,
        },
        create: {
          id: custId,
          name: t.customer.name,
          email: t.customer.email,
          passwordHash: passwordHash,
          role: 'customer',
          avatar: t.customer.avatar || null,
          initials: initials || 'CU',
          company: t.customer.company,
        },
      });
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
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name },
      create: { id: cat.id, name: cat.name },
    });
  }

  // Step 6: Insert Tickets & Comments
  console.log('Inserting Initial Tickets & Comments...');
  for (const t of INITIAL_TICKETS) {
    const custId = t.customer?.email ? customerMap[t.customer.email] : defaultCustomerId;

    await prisma.ticket.create({
      data: {
        id: t.id,
        subject: t.subject,
        description: t.description,
        status: t.status as any,
        priority: t.priority as any,
        categoryId: t.category,
        channel: t.channel as any,
        health: t.health as any,
        assigneeId: t.assignee?.id || null,
        customerId: custId,
        customerName: t.customer.name,
        customerCompany: t.customer.company,
        customerEmail: t.customer.email,
        dueDate: t.dueDate,
        isEscalated: t.isEscalated || false,
        isPastDue: t.isPastDue || false,
        tags: t.tags || [],
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        comments: {
          create: (t.comments || []).map((c) => ({
            id: c.id,
            authorId: t.assignee?.id || null,
            authorName: c.authorName,
            authorAvatar: c.authorAvatar || null,
            authorInitials: c.authorInitials,
            content: c.content,
            timestampDisplay: c.timestamp,
          })),
        },
      },
    });
  }

  console.log('--- Database Seeding Completed Successfully! ---');
  return { success: true, message: 'Database seeded successfully with all initial tickets and users via Modern Prisma 7 ORM' };
}
