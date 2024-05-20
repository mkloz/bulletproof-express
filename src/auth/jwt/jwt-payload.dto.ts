import { z } from 'zod';

export const JwtAuthPayloadValidator = z.object({
  userId: z.number().int().nonnegative(),
});

export type JwtAuthPayload = z.infer<typeof JwtAuthPayloadValidator>;
