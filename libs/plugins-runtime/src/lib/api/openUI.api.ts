import z from 'zod';
import { openUISchema } from '../models/open-ui-options.schema.js';
import { createModal } from '../create-modal.js';

export default z
  .function()
  .args(z.string(), z.string(), z.enum(['dark', 'light']), openUISchema)
  .implement((title, url, theme, options) => {
    return createModal(title, url, theme, options);
  });
