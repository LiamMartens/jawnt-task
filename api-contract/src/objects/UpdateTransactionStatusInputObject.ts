import { z } from "zod";

export const UpdateTransactionStatusInputObject = z.object({
  uuid: z.string().uuid(),
  status: z.enum(["PENDING", "APPROVED", "DENIED"]),
});
