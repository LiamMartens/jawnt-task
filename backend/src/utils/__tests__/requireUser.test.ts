import { expect, it, test } from "vitest";
import { requireUser } from "../ts-rest/index.js";

test("requireUser should work", function () {
  expect(() => requireUser({} as Express.Request)).toThrow();
  expect(() =>
    requireUser({ user: { uuid: "123" } } as Express.Request)
  ).not.toThrow();
});
