type HasUser = Omit<Express.Request, "user"> &
  Required<Pick<Express.Request, "user">>;

export function requireUser(req: Express.Request): asserts req is HasUser {
  if (!req.user?.uuid) {
    const errorObject = new Error("Not authenticated");
    errorObject.cause = {
      status: 401 as const,
      body: { code: 401, reason: "Not authenticated" },
    };
    throw errorObject;
  }
}
