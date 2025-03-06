'use server';

import { google } from "@ai-sdk/google"
import { generateText } from "ai"


export const geminiGenerateSchema = async (query: string) => {
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

            Data Description: ${query}`

            // Using the Vercel AI SDK with Google's model
            const { text } = await generateText({
                model: google('gemini-1.5-flash'),
                prompt: prompt,
                temperature: 0.2, // Lower temperature for more deterministic output
                maxTokens: 1000,
            })

            if (!text) {
                console.log("Failed to generate schema")
                throw new Error("Failed to generate JSON schema")
            }

            return text
    } catch (error) {
        console.error("Error generating schema:", error)
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred")
    }
}