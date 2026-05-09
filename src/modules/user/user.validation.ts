import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional().or(z.literal('')),
  image: z.string().url().optional().or(z.literal('')),
});