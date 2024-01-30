import { z } from "zod";

export const TransactionObject = z.object({
  id: z.string().uuid(),
  reason: z.string(),
  amount_in_cents: z.number().int(),
  currency: z.enum(["USD"]),
  status: z.enum(["PENDING", "APPROVED", "DENIED"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
