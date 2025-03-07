import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "@/server/api/trpc";
import FirecrawlApp from "@mendable/firecrawl-js";

type ExtractedDataValue =
  | string
  | number
  | boolean
  | null
  | ExtractedDataObject
  | ExtractedDataArray;
interface ExtractedDataObject {
  [key: string]: ExtractedDataValue;
}
type ExtractedDataArray = ExtractedDataValue[];

interface ScrapeResult {
  success: boolean;
  data?: Record<string, ExtractedDataValue>;
  error?: string;
}

// Define request schema
const extractRequestSchema = z.object({
  urls: z.array(z.string()).min(1),
  prompt: z.string(),
  schema: z.object({
    type: z.string(),
    properties: z.record(
      z.object({
        type: z.string(),
        description: z.string().optional(),
      }),
    ),
    required: z.array(z.string()).optional(),
  }),
  enableWebSearch: z.boolean().optional(),
  answerBoxData: z
    .object({
      answer: z.string().optional(),
      title: z.string().optional(),
    })
    .optional(),
});

// Define response schema
const responseSchema = z.object({
  success: z.boolean(),
  data: z.record(z.any()).optional(),
  error: z.string().optional(),
});

// Initialize Firecrawl
const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY ?? "",
});

export const extractWebData = protectedProcedure
  .input(extractRequestSchema)
  .output(responseSchema)
  .mutation(async ({ input }) => {
    try {
      const { urls, prompt, schema, enableWebSearch, answerBoxData } = input;
      console.log("Extracting data for:", {
        urls,
        prompt,
        schema,
        enableWebSearch,
      });

      // Validate API key
      if (!process.env.FIRECRAWL_API_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Firecrawl API key is not configured",
        });
      }

      // Validate that URLs are not too many (optional)
      if (urls.length > 20) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Too many URLs requested at once. Please limit to 20 URLs per request.",
        });
      }

      // Validate each URL
      for (const url of urls) {
        try {
          new URL(url); // This will throw if URL is invalid
        } catch (e) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invalid URL provided: ${url}`,
          });
        }
      }

      // Add more specific error handling around the extract call
      let scrapeResult: ScrapeResult;
      try {
        // Perform batch URL extraction with timeout mechanism
        const extractPromise = app.extract(urls, {
          prompt,
          schema,
          enableWebSearch,
        });
        
        // You might want to add a timeout if the library doesn't provide one
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Extraction timed out after 120 seconds"));
          }, 120000); // 2-minute timeout
        });
        
        scrapeResult = await Promise.race([extractPromise, timeoutPromise]) as ScrapeResult;
      } catch (extractError) {
        console.error("Firecrawl extraction error:", extractError);
        
        // Check for specific error types
        const errorMessage = extractError instanceof Error ? extractError.message : "Unknown error";
        
        if (errorMessage.includes("stream closed") || errorMessage.includes("network") || 
            errorMessage.includes("timeout") || errorMessage.includes("connection")) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Connection to extraction service was interrupted. Please try again with fewer URLs or a simpler query.",
          });
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Extraction failed: ${errorMessage}`,
        });
      }

      // Check batch scrape success
      if (!scrapeResult.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: scrapeResult.error ?? "Batch scraping failed",
        });
      }

      // Log success for debugging
      console.log("Extraction completed successfully");

      if (answerBoxData && scrapeResult.success) {
        return {
          success: true,
          data: {
            ...scrapeResult.data,
            answerBox: {
              stockPrice: answerBoxData.answer,
              description: answerBoxData.title,
            },
          },
        };
      }

      // Return the data directly as shown in your example
      return {
        success: true,
        data: scrapeResult.data,
      };
    } catch (error) {
      console.error("Extraction error:", error);

      // Properly handle tRPC errors
      if (error instanceof TRPCError) {
        throw error;
      }

      // Convert other errors to tRPC errors
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to process request",
      });
    }
  });