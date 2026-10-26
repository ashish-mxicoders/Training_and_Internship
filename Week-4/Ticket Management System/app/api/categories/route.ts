// =====================================================================
// API Route: /api/categories
// Method: GET, POST
// Allows listing existing categories and creating new custom categories.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/db';

// GET all categories
export async function GET() {
  try {
    const res = await query(
      `SELECT id, name, created_at FROM categories ORDER BY name ASC;`
    );
    return NextResponse.json({ categories: res.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const trimmed = name.trim();
    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Insert category into database
    const res = await query(
      `
      INSERT INTO categories (id, name)
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
      RETURNING *;
      `,
      [id, trimmed]
    );

    return NextResponse.json({
      success: true,
      category: res.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
