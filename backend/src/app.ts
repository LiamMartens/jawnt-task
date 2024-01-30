import cors from "cors";
import express from "express";
import * as swaggerUi from "swagger-ui-express";
import { generateOpenApi } from "@ts-rest/open-api";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { json, urlencoded } from "body-parser";
import { contract } from "@jawnt-liam/api-contract";
import { client } from "./prisma/client.js";
import { requireUser } from "./utils/ts-rest/requireUser.js";
import { handleThrow } from "./utils/ts-rest/handleThrow.js";
import { UserRole } from "@prisma/client";

const openApiDocument = generateOpenApi(
  contract,
  {
    info: {
      version: "1.0.0",
      title: "Report Service",
      description: `An API contract for a simple CRUD service for storing and retrieving environmental report data.`,
    },
  },
  {
    setOperationId: true,
  }
);

const createApp = () => {
  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors());
  app.use(function (req, res, next) {
    const auth = req.headers.authorization;
    // @README this is just a stub auth to have something in place as an example
    if (auth && auth.match(/^bearer\s+.+$/i)) {
      const userUuid = auth.replace(/^bearer\s+/i, "");
      if (userUuid) {
        req.user = { uuid: userUuid };
      }
    }
    return next();
  });

  // add swagger
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get("/swagger.json", (req, res) => {
    res.json(openApiDocument);
  });

  // init ts-rest
  const s = initServer();
  const router = s.router(contract, {
    getTransactions: async ({ req }) => {
      try {
        requireUser(req);

        const user = await client.user.findFirst({
          where: { id: { equals: req.user.uuid } },
          select: { id: true, role: true, financial_institution_id: true },
        });

        if (!user) {
          return {
            status: 401,
            body: { code: 401, reason: "Invalid user" },
          };
        }

        const transactions = await client.transaction.findMany({
          where:
            user.role === UserRole.MEMBER
              ? { submitted_by_uuid: { equals: user.id } }
              : {
                  SubmittedByUser: {
                    financial_institution_id: {
                      equals: user.financial_institution_id,
                    },
                  },
                },
        });

        return {
          status: 200,
          body: transactions.map((t) => ({
            id: t.id,
            reason: t.reason,
            amount_in_cents: t.amount_in_cents,
            currency: t.currency,
            status: t.status,
            created_at: t.created_at.toISOString(),
            updated_at: t.updated_at.toISOString(),
          })),
        };
      } catch (err) {
        return handleThrow(err);
      }
    },
    submitTransaction: async ({ req }) => {
      try {
        requireUser(req);

        const user = await client.user.findFirst({
          where: { id: { equals: req.user.uuid } },
          select: { id: true },
        });

        if (!user) {
          return {
            status: 401,
            body: { code: 401, reason: "Invalid user" },
          };
        }

        const transaction = await client.transaction.create({
          data: {
            reason: req.body.reason,
            amount_in_cents: req.body.amount_in_cents,
            currency: req.body.currency,
            status: "PENDING",
            SubmittedByUser: {
              connect: {
                id: req.user.uuid,
              },
            },
          },
        });

        return {
          status: 200,
          body: {
            id: transaction.id,
            reason: transaction.reason,
            amount_in_cents: transaction.amount_in_cents,
            currency: transaction.currency,
            status: transaction.status,
            created_at: transaction.created_at.toISOString(),
            updated_at: transaction.updated_at.toISOString(),
          },
        };
      } catch (err) {
        return handleThrow(err);
      }
    },
    updateTransactionStatus: async ({ req }) => {
      try {
        requireUser(req);

        const user = await client.user.findFirst({
          where: { id: { equals: req.user.uuid } },
          select: { id: true, role: true, financial_institution_id: true },
        });

        if (!user) {
          return {
            status: 401,
            body: { code: 401, reason: "Invalid user" },
          };
        }

        if (user.role !== UserRole.ADMINISTRATOR) {
          return {
            status: 403,
            body: { code: 403, reason: "Forbidden" },
          };
        }

        const transaction = await client.transaction.findFirst({
          where: { id: { equals: req.body.uuid } },
        });

        if (!transaction) {
          return {
            status: 404,
            body: { code: 404, reason: "Transaction not found" },
          };
        }

        const updated = await client.transaction.update({
          where: { id: req.body.uuid },
          data: {
            status: req.body.status,
            DecidedByUser: { connect: { id: user.id } },
          },
        });

        return {
          status: 200,
          body: {
            id: updated.id,
            reason: updated.reason,
            amount_in_cents: updated.amount_in_cents,
            currency: updated.currency,
            status: updated.status,
            created_at: updated.created_at.toISOString(),
            updated_at: updated.updated_at.toISOString(),
          },
        };
      } catch (err) {
        return handleThrow(err);
      }
    },
  });

  createExpressEndpoints(contract, router, app);
  return app;
};

export default createApp;
