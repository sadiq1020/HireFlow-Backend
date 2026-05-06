import { z } from 'zod';

const createJobValidationSchema = z.object({
  body: z.object({
    // Validation schema here
  }),
});

export const JobValidation = {
  createJobValidationSchema,
};
