import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Redis } from "@upstash/redis";

import { publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

// Initialize Redis client
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL || "",
  token: env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Validation schema
const deployRequestSchema = z.object({
  key: z.string().min(1, "Key is required"),
  data: z.object({
    data: z.record(z.any()),
    metadata: z.object({
      query: z.string(),
      schema: z.object({
        type: z.string(),
        properties: z.record(z.any()),
        required: z.array(z.string()).optional(),
      }),
      sources: z.array(z.string()),
      lastUpdated: z.string(),
    }),
  }),
  route: z.string().min(1, "Route is required"),
});

export const deployRouter = publicProcedure
  .input(deployRequestSchema)
  .mutation(async ({ input }) => {
    try {
      const { key, data, route } = input;

      // Clean the route string
      const cleanRoute = route
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .trim();

      // Check if route already exists
      const existingRoute = await redis.get(`api/results/${cleanRoute}`);
      if (existingRoute) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Route already exists",
        });
      }

      // Store the data in Redis
      await redis.set(`api/results/${cleanRoute}`, JSON.stringify(data));

      const apiRoute = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const fullUrl = `${apiRoute}/api/results/${cleanRoute}`;

      return {
        success: true,
        message: "API endpoint deployed successfully",
        route: cleanRoute,
        url: fullUrl,
        curlCommand: `curl -X GET "${fullUrl}" \\\n  -H "Authorization: Bearer sk_w4964vzs5p" \\\n  -H "Content-Type: application/json"`,
      };
    } catch (error) {
      // Handle Redis connection errors
      if (error instanceof Error && !(error instanceof TRPCError)) {
        console.error("Redis operation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to deploy endpoint due to database error",
          cause: error,
        });
      }

      // Re-throw tRPC errors
      throw error;
    }
  });