import { z } from 'zod';

export const manifestSchema = z.object({
  name: z.string(),
  host: z.string().url(),
  code: z.string(),
  icon: z.string().optional(),
  description: z.string().max(200).optional(),
  permissions: z.array(
    z.enum([
      'page:read',
      'page:write',
      'file:read',
      'file:write',
      'selection:read',
    ])
  ),
});
