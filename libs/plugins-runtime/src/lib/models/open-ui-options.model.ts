import z from 'zod';
import { openUISchema } from './open-ui-options.schema';

export type OpenUIOptions = z.infer<typeof openUISchema>;
