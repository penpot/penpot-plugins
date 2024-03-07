import { z } from 'zod';

export const openUISchema = z.object({
  theme: z.literal('dark') || z.literal('light'),
  width: z.number().positive(),
  height: z.number().positive(),
});
