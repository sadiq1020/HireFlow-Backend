import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { CategoryService } from './category.service';
import { createCategorySchema, updateCategorySchema } from './category.validation';

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    data: categories,
  });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = createCategorySchema.parse(req.body);
  const category = await CategoryService.createCategory(payload);
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = updateCategorySchema.parse(req.body);
  const category = await CategoryService.updateCategory(req.params.id as string, payload);
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id as string);
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

export const CategoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};