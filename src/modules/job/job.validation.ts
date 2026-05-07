import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  deadline: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
});

export const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  requirements: z.string().optional(),
  location: z.string().min(1).optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  deadline: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
});