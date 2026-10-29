'use server';

// =====================================================================
// Next.js Server Actions: Categories
// =====================================================================

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db/db';
import { ActionResponse, CategoryItem } from '@/types';

export async function addCategoryAction(
  name: string
): Promise<ActionResponse<CategoryItem>> {
  try {
    const trimmed = name?.trim();
    if (!trimmed) {
      return { success: false, error: 'Category name is required' };
    }

    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const result = await query(
      `
      INSERT INTO categories (id, name, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, name;
      `,
      [id, trimmed]
    );

    revalidatePath('/tickets');

    return {
      success: true,
      message: 'Category added successfully',
      data: result.rows[0],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add category';
    return { success: false, error: message };
  }
}

