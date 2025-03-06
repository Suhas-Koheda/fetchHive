import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@/server/api/trpc';
import FirecrawlApp from "@mendable/firecrawl-js";

type ExtractedDataValue = string | number | boolean | null | ExtractedDataObject | ExtractedDataArray;
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
        properties: z.record(z.object({
            type: z.string(),
            description: z.string().optional(),
        })),
        required: z.array(z.string()).optional(),
    }),
    enableWebSearch: z.boolean().optional(),
    answerBoxData: z.object({
        answer: z.string().optional(),
        title: z.string().optional()
    }).optional()
});

// Define response schema
const responseSchema = z.object({
    success: z.boolean(),
    data: z.record(z.any()).optional(),
    error: z.string().optional()
});

// Initialize Firecrawl
const app = new FirecrawlApp({ 
    apiKey: process.env.FIRECRAWL_API_KEY ?? '' 
});

export const extractWebData = publicProcedure
    .input(extractRequestSchema)
    .output(responseSchema)
    .mutation(async ({ input }) => {
        try {
            const { urls, prompt, schema, enableWebSearch, answerBoxData } = input;
            console.log('Extracting data for:', { urls, prompt, schema, enableWebSearch });

            // Validate API key
            if (!process.env.FIRECRAWL_API_KEY) {
                throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Firecrawl API key is not configured'
                });
            }

            // Perform batch URL extraction
            const scrapeResult: ScrapeResult = await app.extract(urls, {
                prompt,
                schema,
                enableWebSearch
            });

            // Check batch scrape success
            if (!scrapeResult.success) {
                throw new TRPCError({
                code: 'BAD_REQUEST',
                message: scrapeResult.error ?? 'Batch scraping failed'
                });
            }

            if (answerBoxData && scrapeResult.success) {
                return {
                    success: true,
                    data: {
                        ...scrapeResult.data,
                        answerBox: {
                            stockPrice: answerBoxData.answer,
                            description: answerBoxData.title
                        }
                    }
                };
            }

            // Return the data directly as shown in your example
            return {
                success: true,
                data: scrapeResult.data
            };
        } catch (error) {
            console.error('Extraction error:', error);
            
            // Properly handle tRPC errors
            if (error instanceof TRPCError) {
                throw error;
            }
            
            // Convert other errors to tRPC errors
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Failed to process request'
            });
        }
    });