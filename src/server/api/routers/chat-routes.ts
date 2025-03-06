import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc";
import { Redis } from "@upstash/redis";
import { env } from "@/env";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL ?? "",
  token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export const chatRouter = createTRPCRouter({
  // GET equivalent - list all routes
  list: publicProcedure.query(async () => {
    try {
      // Get all keys matching the pattern
      const keys = await redis.keys("api/results/*");
      const routes = [];

      for (const key of keys) {
        const config = await redis.get(key);
        if (config) {
          const endpoint = key.replace("api/results/", "");
          routes.push({
            endpoint,
            config: typeof config === "string" ? JSON.parse(config) : config,
            url: `/api/results/${endpoint}`,
          });
        }
      }

      return {
        success: true,
        routes,
      };
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to fetch routes");
    }
  }),

  // POST equivalent - update a route
  update: publicProcedure
    .input(
      z.object({
        endpoint: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { endpoint } = input;

        // Get the existing configuration
        const configKey = `api/results/${endpoint}`;
        const config = await redis.get(configKey);

        if (!config) {
          throw new Error("Route not found");
        }

        // Re-run extraction with existing configuration
        const extractResponse = await fetch(
          `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/extract`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
          },
        );

        const extractData = await extractResponse.json();
        if (!extractData.success) {
          throw new Error(extractData.error);
        }

        // Update the results
        await redis.set(configKey, {
          ...config,
          updatedAt: new Date().toISOString(),
        });

        return {
          success: true,
          message: "Route updated successfully",
          data: extractData.data,
        };
      } catch (error) {
        console.error("Error:", error);
        throw new Error(
          `Failed to update route: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),

  // DELETE equivalent - delete a route
  delete: publicProcedure
    .input(
      z.object({
        endpoint: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { endpoint } = input;

        // Delete the route
        await redis.del(`api/results/${endpoint}`);

        return {
          success: true,
          message: "Route deleted successfully",
        };
      } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to delete route");
      }
    }),

  // PUT equivalent - create a new route
  create: publicProcedure
    .input(
      z.object({
        endpoint: z.string(),
        urls: z.array(z.string()),
        query: z.string(),
        schema: z.record(z.any()),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { endpoint, urls, query, schema } = input;

        // Extract data using the provided configuration
        const extractResponse = await fetch(
          `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/extract`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls, query, schema }),
          },
        );

        const extractData = await extractResponse.json();
        if (!extractData.success) {
          throw new Error(extractData.error);
        }

        // Store the configuration and initial results
        const configKey = `api/results/${endpoint}`;
        await redis.set(configKey, {
          urls,
          query,
          schema,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return {
          success: true,
          message: "Route deployed successfully",
          data: extractData.data,
          url: `/api/results/${endpoint}`,
        };
      } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to deploy route");
      }
    }),
});
