# 🚀 Week 6: Ticket Management System (Prisma ORM + Neon PostgreSQL)

Welcome to **Week 6** of your Training and Internship program!

In this week, we have upgraded and rebuilt the full-stack **Ticket Management System (Helpdesk TMS)** using **Prisma ORM** with **Neon Serverless PostgreSQL**, **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 📁 Project Directory

The complete project lives in:
```text
Week-6/Ticket Management System/
├── app/
│   ├── actions/               # Server Actions (Auth, Tickets, Categories) using Prisma
│   ├── api/                   # REST API Routes (Tickets, Users, Categories, Auth, Seed)
│   ├── tickets/               # Kanban Board & Ticket Detail Pages
│   └── ...
├── components/                # React UI Components (Kanban, Table, Modals, Forms)
├── lib/
│   ├── prisma.ts              # Global Prisma Client Singleton
│   ├── auth.ts                # JWT authentication & session management
│   └── db/
│       └── seed.ts            # Prisma Database Seeder
├── prisma/
│   └── schema.prisma          # Prisma Schema with Models & Relations
├── scripts/
│   └── seed-prisma.cjs        # Standalone Node.js Seeder Script
├── .env                       # Pre-configured with your Neon DB connection string & JWT secret
├── .env.example               # Template
├── package.json               # Dependencies with Prisma CLI & Client
└── readme.md                  # Comprehensive Documentation & UI Showcase
```

---

## 🗄️ Prisma Models (`prisma/schema.prisma`)

- **`User`** (`users` table): Admins and Customers with password hash, roles, and avatar/initials.
- **`Category`** (`categories` table): Technical, Billing, Account, etc.
- **`Ticket`** (`tickets` table): Support tickets with priority, SLA health, due dates, assignee, customer, and relations.
- **`Comment`** (`comments` table): Conversation activity thread linked to tickets.

---

## ⚙️ Environment Configuration (`.env`)

The `.env` file is already created and configured with the exact same values from Week-4:

```env
DATABASE_URL=postgresql://neondb_owner:npg_U9Gk7EyKbOjR@ep-old-cake-b4f4asqj-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_ticket_management_system_2026_mxicoders
```

---

## 💻 How to Run

1. Open terminal and enter the project folder:
   ```powershell
   cd "Week-6\Ticket Management System"
   ```

2. Generate Prisma Client (Already generated during setup):
   ```powershell
   npm run prisma:generate
   ```

3. (Optional) Run Prisma Studio to view database records in a browser GUI:
   ```powershell
   npm run prisma:studio
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Login Credentials

All passwords in seed data are set to **`123456`**:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@acme.io` | `123456` | Full Kanban, status changes, assignments, ticket deletion |
| **Admin** | `jason.duong@acme.io` | `123456` | Support Engineer (Assigned to initial tickets) |
| **Customer** | `customer@client.com` | `123456` | Customer portal, create tickets, view own tickets |
