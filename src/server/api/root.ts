import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { extractWebData } from "@/server/api/routers/extract";
import { searchWeb } from "@/server/api/routers/search";
import { generateJsonSchema } from "@/server/api/routers/generate-schema";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    extract: extractWebData,
    search: searchWeb,
    generateSchema: generateJsonSchema
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
