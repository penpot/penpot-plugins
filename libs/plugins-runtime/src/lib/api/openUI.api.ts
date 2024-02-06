import z from 'zod';
import { openUISchema } from '../models/open-ui-options.schema';
import { createModal } from '../create-modal';

export default z
  .function()
  .args(z.string(), z.string(), openUISchema)
  .implement((title, url, options) => {
    return createModal(title, url, options);
  });
