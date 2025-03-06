import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { Redis } from "@upstash/redis";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL ?? "",
  token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export const chatRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
      })
    )
    .query(async ({ input }) => {
      try {
        const { userId } = input;
        
        // Get all keys matching the pattern for this user
        const keys = await redis.keys(`api/results/${userId}/*`);
        const endpoints = [];

        for (const key of keys) {
          const apiData = await redis.get(key);
          if (apiData) {
            const endpoint = key.replace(`api/results/${userId}/`, "");
            const parsedData = typeof apiData === "string" ? JSON.parse(apiData) : apiData;
            
            endpoints.push({
              endpoint,
              name: endpoint,
              query: parsedData.metadata?.query || "Unknown query",
              lastUpdated: parsedData.metadata?.lastUpdated || "Unknown date",
              url: `/api/results/${userId}/${endpoint}`,
            });
          }
        }

        return {
          success: true,
          endpoints,
        };
      } catch (error) {
        console.error("Error listing endpoints:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch API endpoints",
        });
      }
    }),

  // GET equivalent - get a single route
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        endpoint: z.string().min(1, "Endpoint name is required"),
      })
    )
    .query(async ({ input }) => {
      try {
        const { userId, endpoint } = input;
        
        // Get the API data from Redis
        const apiData = await redis.get(`api/results/${userId}/${endpoint}`);
        
        if (!apiData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "API endpoint not found",
          });
        }
        
        return {
          success: true,
          data: typeof apiData === "string" ? JSON.parse(apiData) : apiData,
          url: `/api/results/${userId}/${endpoint}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error("Error fetching endpoint:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch API endpoint",
        });
      }
    }),
});
