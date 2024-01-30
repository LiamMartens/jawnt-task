import { PrismaClient, TransactionStatus, UserRole } from "@prisma/client";
import createApp from "../app.js";
import request from "supertest";
import { test, vi, beforeEach } from "vitest";
import { client } from "../prisma/client.js";
import { DeepMockProxy } from "vitest-mock-extended";

const app = createApp();

const mockUser = {
  id: "b206d2b8-2638-4133-b31f-f7a1399e7ff4",
  role: UserRole.MEMBER,
  first_name: "John",
  last_name: "Doe",
  financial_institution_id: "b206d2b8-2638-4133-b31f-f7a1399e7ff4",
  created_at: new Date("2024-01-30T10:00:00.000Z"),
  updated_at: new Date("2024-01-30T10:00:00.000Z"),
};

beforeEach(() => {
  vi.mock("../prisma/client.js", async () => {
    const { mockDeep } = await import("vitest-mock-extended");
    const prismaClientMock = mockDeep<PrismaClient>();

    return {
      __esModule: true,
      client: prismaClientMock,
    };
  });
});

test("Can create a transaction", async () => {
  const mocked = vi.mocked(client) as DeepMockProxy<PrismaClient>;
  mocked.user.findFirst.mockResolvedValueOnce(mockUser);

  const transactionInput = {
    reason: "Foobar",
    amount_in_cents: 5000,
    currency: "USD" as const,
  };

  mocked.transaction.create.mockResolvedValue({
    id: "b206d2b8-2638-4133-b31f-f7a1399e7ff4",
    amount_in_cents: transactionInput.amount_in_cents,
    currency: transactionInput.currency,
    reason: transactionInput.reason,
    created_at: new Date("2024-01-30T10:00:00.000Z"),
    updated_at: new Date("2024-01-30T10:00:00.000Z"),
    status: TransactionStatus.PENDING,
    decided_by_uuid: null,
    submitted_by_uuid: mockUser.id,
  });

  await request(app)
    .post("/transaction")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${mockUser.id}`)
    .send(JSON.stringify(transactionInput))
    .expect(200);
});
