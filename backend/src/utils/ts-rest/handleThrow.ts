import { TypeOf } from "zod";
import { objects } from "@jawnt-liam/api-contract";

export function handleThrow(err: unknown) {
  console.error(err);

  if (err && err instanceof Error && err.cause) {
    return err.cause as {
      status: 401 | 403 | 500;
      body: TypeOf<typeof objects.ErrorObject>;
    };
  }

  return {
    status: 500 as const,
    body: {
      code: 500,
      reason: err && err instanceof Error ? err.message : String(err),
    },
  };
}
