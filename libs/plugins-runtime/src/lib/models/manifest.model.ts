import z from 'zod';
import { manifestSchema } from './manifest.schema';

export type Manifest = z.infer<typeof manifestSchema>;
