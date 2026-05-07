import { z } from 'zod';

export const approveCompanySchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionNote: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});