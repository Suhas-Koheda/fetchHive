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
  .input(
    z.object({
      userId: z.string().min(1, "User ID is required"),
      schema: z.record(z.any()).nullable(),
      extractedData: z.record(z.any()).nullable(),
      name: z.string().min(1, "API name is required"),
      query: z.string().min(1, "Query is required"),
      urls: z.array(z.string()).min(1, "At least one URL is required"),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const { userId, schema, extractedData, name, query, urls } = input;

      if (!schema || !extractedData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Schema and extracted data are required",
        });
      }

      // Clean the route name
      const cleanRoute = name
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .trim();

      // Check if route already exists for this user
      const existingRoute = await redis.get(`api/results/${userId}/${cleanRoute}`);
      if (existingRoute) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "API endpoint with this name already exists",
        });
      }

      // Prepare the data to store
      const apiData = {
        data: extractedData,
        metadata: {
          query,
          schema,
          sources: urls,
          lastUpdated: new Date().toISOString(),
        },
        config: {
          urls,
          query,
          schema,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      // Store the data in Redis with userId in the key
      await redis.set(`api/results/${userId}/${cleanRoute}`, JSON.stringify(apiData));

      const apiRoute = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const fullUrl = `${apiRoute}/api/results/${userId}/${cleanRoute}`;

      return {
        success: true,
        message: "API endpoint deployed successfully",
        route: cleanRoute,
        url: fullUrl,
        curlCommand: `curl -X GET "${fullUrl}" \\\n  -H "Content-Type: application/json"`,
        apiData,
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