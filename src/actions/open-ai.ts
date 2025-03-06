'use server';

import { env } from '@/env';
import { createAzure } from '@ai-sdk/azure';
import { generateText } from 'ai';

const azure = createAzure({
    apiKey: env.AZURE_API_KEY,
    resourceName: env.AZURE_RESOURCE_NAME,
    apiVersion: "2024-05-01-preview",
});

export const openAiGenerateSchema = async (query: string) => {
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
        
        const { text } = await generateText({
            model: azure('gpt-4o-mini'),
            prompt: prompt,
            maxTokens: 1000,
            temperature: 0.2,
        });

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