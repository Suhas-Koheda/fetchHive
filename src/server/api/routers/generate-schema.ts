import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { generateText } from "ai"
import { google } from '@ai-sdk/google';

import { protectedProcedure } from "@/server/api/trpc"

export const generateJsonSchema = protectedProcedure
    .input(
        z.object({
            query: z.string().min(1, "Description cannot be empty"),
        }),
    )
    .output(
        z.object({
            schema: z.record(z.any()),
        }),
    )
    .mutation(async ({ input }) => {
        try {
            const prompt = `You are a JSON Schema generator. Given a description of data, generate a JSON Schema that matches the description. 
            Follow these rules:
            1. Use appropriate types (string, number, boolean, array, object)
            2. Add required fields when they are essential
            3. Use descriptive property names
            4. Add descriptions for complex fields
            5. Use proper JSON Schema format
            6. Respond ONLY with the valid JSON Schema
            7. Do not include any explanatory text before or after the JSON Schema

            Data Description: ${input.query}`

            // Using the Vercel AI SDK with Google's model
            const { text } = await generateText({
                model: google('gemini-1.5-flash'),
                prompt: prompt,
                temperature: 0.2, // Lower temperature for more deterministic output
                maxTokens: 1000,

            })

            if (!text) {
                console.log("Failed to generate schema")
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate JSON schema",
                    cause: text,
                })
            }

            // Remove any markdown code block formatting if present
            const cleanSchemaStr = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()

            if (!cleanSchemaStr) {
                console.log("Failed to generate schema")
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate JSON schema",
                    cause: text,
                })
            }

            // Parse the schema to ensure it's valid
            const schema = JSON.parse(cleanSchemaStr)

            return { schema }
        } catch (error) {
            console.error("Error generating schema:", error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to generate JSON schema",
                cause: error,
            })
        }
    })