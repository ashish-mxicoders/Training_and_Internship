// =====================================================================
// API Route: /api/seed
// Method: POST / GET
// This endpoint resets the database tables and seeds all default mock
// data (Admins, Customers with password hash for '123456', Categories,
// and 20 Tickets with Comments).
// Also used by the "Restore Seed Data" button on the Settings page!
// =====================================================================

import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database reset and seeded with default data successfully!',
      details: result,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed database',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Allow GET request for convenient testing or initial setup
  return POST();
}
