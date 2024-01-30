# Server app

For simplicity this app should be run using [Bun](https://bun.sh/) which has native TypeScript support [`bun run start`].
The app uses [Express](https://expressjs.com/) in combination with [TS Rest](https://ts-rest.com/) for E2E type safety.

A basic test suite has been set-up using [Vitest](https://vitest.dev/).

The server has a Swagger UI and JSON configured which can be viewed/inspected at `/swagger` and `/swagger.json` respectively.
