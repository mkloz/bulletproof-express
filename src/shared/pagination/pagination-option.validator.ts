import { z } from 'zod';
import { DEFAULT_ITEMS_LIMIT, DEFAULT_PAGE } from './pagination-options.dto';

export const PaginationOptValidator = z.object({
  page: z.coerce.number().default(DEFAULT_PAGE),
  limit: z.coerce.number().default(DEFAULT_ITEMS_LIMIT),
});
0;
