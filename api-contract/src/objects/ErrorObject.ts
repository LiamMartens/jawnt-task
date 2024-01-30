import { z } from "zod";

export const ErrorObject = z.object({
  code: z.number(),
  reason: z.string(),
});
