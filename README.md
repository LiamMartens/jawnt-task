# Project set-up
### Package manager & runtime
The project has been set-up with [Bun](https://bun.sh/) as it's package manager and runtime. This makes it simpler to run TypeScript files since no additional build is required.

### Structure
The codebase is structured as a monorepository with the following parts:
- `api-contract`  
  This is the API contract schema created to be shared between app and server.
- `backend`  
  This is the server application.
- `frontend`  
  This is the front-end web application.

### Quickstart
1. Start the local Postgres database using the make job: `make start-local-db`
2. Install the dependencies using bun (`bun install`)
3. Build the shared `api-contract` package (`bun turbo run compile'`)
4. Running the server
  1. Navigate to the `./backend` directory
  2. Copy the `.env.example` file to `.env.`
  3. Run the development migrations using the following command (`bun prisma migrate dev`)
  4. Run the development seed (`bun prisma db seed`)
  5. Run the server app itself using the command: `bun run start`
5. Running the front-end
  1. Navigate to the `./frontend` directory
  2. Run the app using the command `bun run dev`
