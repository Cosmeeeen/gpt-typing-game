import { createTRPCRouter } from "~/server/api/trpc";
import { testResultsRouter } from "./routers/testResults";
import { userRouter } from './routers/user';
import { githubRouter } from "./routers/github";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  testResults: testResultsRouter,
  users: userRouter,
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
