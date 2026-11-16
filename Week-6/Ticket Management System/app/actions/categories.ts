'use server';

// =====================================================================
// Next.js Server Actions: Categories
// Powered by Prisma ORM
// =====================================================================

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
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

    // Upsert using Prisma ORM
    const category = await prisma.category.upsert({
      where: { id },
      update: { name: trimmed },
      create: { id, name: trimmed },
    });

    revalidatePath('/tickets');

    return {
      success: true,
      message: 'Category added successfully',
      data: {
        id: category.id,
        name: category.name,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add category';
    return { success: false, error: message };
  }
}
