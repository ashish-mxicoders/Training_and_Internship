// =====================================================================
// Database Schema & Initialization
// Here we define raw SQL DDL commands to create all tables in Neon PostgreSQL.
// This handles:
// 1. users: Stores Admins and Customers with password hash & role
// 2. categories: Stores categories (e.g. Technical, Billing, etc.)
// 3. tickets: Stores tickets with assignee, customer, status, due date, etc.
// 4. comments: Stores conversation replies for each ticket
// =====================================================================

import { query } from './db';

/**
 * Function to drop all old tables and re-create clean schema.
 * Called during fresh setup or when restoring seed data.
 */
export async function resetDatabaseSchema() {
  console.log('Resetting and initializing database schema...');

  // Step 1: Drop old tables if they exist (in reverse dependency order)
  await query(`DROP TABLE IF EXISTS comments CASCADE;`);
  await query(`DROP TABLE IF EXISTS tickets CASCADE;`);
  await query(`DROP TABLE IF EXISTS categories CASCADE;`);
  await query(`DROP TABLE IF EXISTS users CASCADE;`);

  // Step 2: Create users table
  await query(`
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

  // Step 3: Create categories table
  await query(`
    CREATE TABLE categories (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Step 4: Create tickets table
  await query(`
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

  // Step 5: Create comments table
  await query(`
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

  console.log('Database schema created successfully!');
}

/**
 * Ensures tables exist without dropping existing data.
 */
export async function ensureTablesExist() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
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

  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS tickets (
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

  await query(`
    CREATE TABLE IF NOT EXISTS comments (
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
}
