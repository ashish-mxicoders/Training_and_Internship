// =====================================================================
// API Route: /api/categories
// Method: GET, POST
// Allows listing existing categories and creating new custom categories.
// Powered by Prisma ORM.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// POST: Create or upsert category
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

    const category = await prisma.category.upsert({
      where: { id },
      update: { name: trimmed },
      create: { id, name: trimmed },
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
