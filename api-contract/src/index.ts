import { z } from "zod";
import { initContract } from "@ts-rest/core";
import {
  ErrorObject,
  TransactionInputObject,
  TransactionObject,
  UpdateTransactionStatusInputObject,
} from "./objects/index.js";

const c = initContract();

export * as objects from "./objects/index.js"

export const contract = c.router({
  getTransactions: {
    method: "GET",
    path: "/transactions",
    summary: "Retrieves the transactions for the current user",
    responses: {
      200: z.array(TransactionObject),
      401: ErrorObject,
      403: ErrorObject,
      500: ErrorObject,
    },
  },
  submitTransaction: {
    method: "POST",
    path: "/transaction",
    summary: "Submits a new transaction",
    body: TransactionInputObject,
    responses: {
      200: TransactionObject,
      401: ErrorObject,
      403: ErrorObject,
      500: ErrorObject,
    },
  },
  updateTransactionStatus: {
    method: "PUT",
    path: "/transaction/status",
    summary: "Updates a transaction status",
    body: UpdateTransactionStatusInputObject,
    responses: {
      200: TransactionObject,
      401: ErrorObject,
      403: ErrorObject,
      404: ErrorObject,
      500: ErrorObject,
    },
  },
});
