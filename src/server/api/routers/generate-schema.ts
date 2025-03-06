import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { openAiGenerateSchema } from "@/actions/open-ai"
import { geminiGenerateSchema } from "@/actions/gemini-ai"

import { protectedProcedure } from "@/server/api/trpc"

export const generateJsonSchema = protectedProcedure
    .input(
        z.object({
            query: z.string().min(1, "Description cannot be empty"),
            provider: z.enum(["openai", "gemini"]).default("gemini"),
        }),
    )
    .output(
        z.object({
            schema: z.record(z.any()),
        }),
    )
    .mutation(async ({ input }) => {
        try {
            const { query, provider } = input

            // Generate schema based on provider
            let text: string;
            try {
                text = await (provider === "openai" 
                    ? openAiGenerateSchema(query)
                    : geminiGenerateSchema(query)
                );
                
                if (!text) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: `No response received from ${provider}`,
                        cause: "Empty response"
                    });
                }
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to generate schema with ${provider}`,
                    cause: error
                });
            }

            // Remove any markdown code block formatting if present
            const cleanSchemaStr = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()

            if (!cleanSchemaStr) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to generate schema using ${provider}`,
                    cause: "Empty response from AI",
                })
            }

            try {
                // Parse the schema to ensure it's valid
                const schema = JSON.parse(cleanSchemaStr)
                return { schema }
            } catch (parseError) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid JSON schema generated",
                    cause: parseError,
                })
            }

        } catch (error) {
            console.error(`Error generating schema with ${input.provider}:`, error)
            
            if (error instanceof TRPCError) {
                throw error
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to generate schema using ${input.provider}`,
                cause: error,
            })
        }
    })