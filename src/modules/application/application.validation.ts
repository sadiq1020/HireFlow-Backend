import { z } from 'zod';

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url().optional(),
});