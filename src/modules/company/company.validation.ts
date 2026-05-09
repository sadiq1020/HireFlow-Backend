import { z } from 'zod';

export const createCompanySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  logo: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
});

export const updateCompanySchema = z.object({
  companyName: z.string().min(1).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED']),
});