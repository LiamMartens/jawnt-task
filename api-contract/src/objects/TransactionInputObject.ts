import { z } from "zod";

export const TransactionInputObject = z.object({
  reason: z.string(),
  amount_in_cents: z.number().int(),
  currency: z.enum(["USD"]),
});
