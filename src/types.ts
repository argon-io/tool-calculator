import { z } from 'zod';

export const payload = z.object({
  expr: z.string().min(1),
});

export const result = z.object({
  result: z.string(),
});