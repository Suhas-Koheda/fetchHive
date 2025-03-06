import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@/server/api/trpc';
import { env } from '@/env';

// Define a type for the Serper API search result
type SerperSearchResult = {
    title?: string;
    link: string;
    snippet?: string;
};

// Define a type for the Serper API response
type SerperApiResponse = {
    organic?: SerperSearchResult[];
    answerBox?: {
        answer?: string;
        title?: string;
        link?: string;
    };
};

export const searchWeb = publicProcedure
    .input(
        z.object({
            query: z.string().min(1, "Query cannot be empty"),
            limit: z.number().int().min(1).max(10).default(6)
        })
    )
    .output(
        z.object({
            success: z.boolean(),
            searchResults: z.object({
                organic: z.array(
                    z.object({
                        title: z.string(),
                        link: z.string().url(),
                        snippet: z.string().optional()
                    })
                ).optional(),
                answerBox: z.object({
                    answer: z.string().optional(),
                    title: z.string().optional(),
                    link: z.string().url().optional()
                }).optional()
            }).optional(),
            error: z.string().optional()
        })
    )
    .mutation(async ({ input }) => {
        try {
            const { query, limit } = input;
            const serperApiKey = env.SERPER_API_KEY;

            if (!serperApiKey) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Search API key is not configured'
                });
            }

            const response = await fetch('https://google.serper.dev/search', {
                method: 'POST',
                headers: {
                    'X-API-KEY': serperApiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: query,
                    num: limit
                })
            });

            if (!response.ok) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: `Search request failed with status: ${response.status}`
                });
            }

            const data = await response.json() as SerperApiResponse;

            // Validate and process the results
            if (!data || (!data.organic && !data.answerBox)) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'No search results found'
                });
            }

            console.log("Search Results", data);

            return {
                success: true,
                searchResults: {
                    organic: data.organic?.slice(0, limit).map(result => ({
                        title: result.title ?? 'Untitled',
                        link: result.link,
                        snippet: result.snippet ?? ''
                    })),
                    answerBox: data.answerBox ? {
                        answer: data.answerBox.answer,
                        title: data.answerBox.title,
                        link: data.answerBox.link
                    } : undefined
                }
            };
        } catch (error) {
            console.error('Web Search Error:', error);

            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error during web search'
            });
        }
    });