import { z } from 'zod';

export const manifestSchema = z.object({
  name: z.string(),
  code: z.string().url(),
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
