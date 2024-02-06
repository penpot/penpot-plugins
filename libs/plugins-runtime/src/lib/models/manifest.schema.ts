import { z } from 'zod';

export const manifestSchema = z.object({
  name: z.string(),
  code: z.string().url(),
});
