import cache from '../../config/cache';
import prisma from '../../lib/prisma';
import AppError from '../../shared/appError';
import { ICategory } from './category.interface';

const getAllCategories = async () => {
  const cacheKey = 'categories:all';
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { jobs: true } },
    },
  });

  cache.set(cacheKey, categories, 300); // cache for 5 minutes

  return categories;
};

const createCategory = async (payload: ICategory) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new AppError(409, 'Category with this name already exists');
  }

  const category = await prisma.category.create({
    data: payload,
  });

  cache.delete('categories:all'); // invalidate cache

  return category;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, 'Category not found');
  }

  const category = await prisma.category.update({
    where: { id },
    data: payload,
  });

  cache.delete('categories:all'); // invalidate cache

  return category;
};

const deleteCategory = async (id: string) => {
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, 'Category not found');
  }

  await prisma.category.delete({ where: { id } });

  cache.delete('categories:all'); // invalidate cache
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};