import { z } from 'zod';

export const IdDtoValidator = z.object({
  id: z.coerce.number().nonnegative(),
});
