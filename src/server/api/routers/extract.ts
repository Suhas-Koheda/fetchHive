/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@/server/api/trpc';
import FirecrawlApp from "@mendable/firecrawl-js";

// Define request schema
const extractRequestSchema = z.object({
    urls: z.array(z.string()).min(1),
    query: z.string(),
    schema: z.object({}).passthrough()
});

// Initialize Firecrawl
const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY ?? ''
});

export const extractWebData = publicProcedure
    .input(extractRequestSchema)
    .output(
        z.object({
            success: z.boolean(),
            data: z.array(
                z.object({
                    url: z.string(),
                    markdown: z.string(),
                    metadata: z.object({
                        title: z.string(),
                        description: z.string(),
                        sourceURL: z.string(),
                        keywords: z.string().optional(),
                        ogDescription: z.string().optional()
                    })
                })
            ).optional(),
            error: z.string().optional()
        })
    )
    .mutation(async ({ input }) => {
        try {
            const { urls, query, schema } = input;
            console.log('Extracting data for:', { urls, query, schema });

            // Validate API key
            if (!process.env.FIRECRAWL_API_KEY) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Firecrawl API key is not configured'
                });
            }

            // Perform batch URL extraction
            const batchScrapeResult = await app.batchScrapeUrls(urls, { 
                formats: ['markdown', 'html'] 
            });

            // Check batch scrape success
            if (!batchScrapeResult.success) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: batchScrapeResult.error ?? 'Batch scraping failed'
                });
            }

            // Transform results to match output schema
            const transformedData = batchScrapeResult.data.map((item, index) => ({
                url: urls[index]!,  // Non-null assertion
                markdown: item.markdown ?? '',
                metadata: {
                    title: item.metadata?.title ?? '',
                    description: item.metadata?.description ?? '',
                    sourceURL: item.metadata?.sourceURL ?? urls[index]!,
                    keywords: item.metadata?.keywords ?? '',
                    ogDescription: item.metadata?.ogDescription ?? ''
                }
            }));

            return {
                success: true,
                data: transformedData
            };
        } catch (error) {
            console.error('Extraction error:', error);

            // Handle tRPC errors specifically
            if (error instanceof TRPCError) {
                throw error;
            }

            // Fallback error handling
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Failed to process request'
            });
        }
    });