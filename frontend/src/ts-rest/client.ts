import { contract } from "@jawnt-liam/api-contract";
import { initClient } from "@ts-rest/core";

export const client = initClient(contract, {
  baseUrl: "http://localhost:8000",
  baseHeaders: {
    Authorization: `Bearer c2d29867-3d0b-d497-9191-18a9d8ee7830`,
  },
});
