"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { type JsonSchema } from "@/utils/convert-json-to-zod";

// Define output types from your router
type RouterOutputs = inferRouterOutputs<AppRouter>;
type SearchResult = RouterOutputs["search"];
type SchemaResult = RouterOutputs["generateSchema"];
type ExtractResult = RouterOutputs["extract"];

export default function ChatPage() {
  const [query, setQuery] = useState("Latest Nvidia Stocks");
  const [schema, setSchema] = useState<SchemaResult["schema"] | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractResult | null>(null);
  
  // Extract mutation
  const extractMutation = api.extract.useMutation({
    onSuccess: (data: ExtractResult) => {
      console.log("Extraction successful:", data);
      setExtractedData(data);
    },
    onError: (error) => {
      console.error("Extraction error:", error);
    }
  });

  // Search mutation with proper type annotation
  const searchMutation = api.search.useMutation({
    onSuccess: (data: SearchResult) => {
      console.log("Search results:", data);
      setSearchResults(data);
      
      // If we have a schema and search results, perform extraction
      if (schema && data.searchResults?.organic) {
        // Get URLs from search results
        const urls = data.searchResults.organic
          .map(result => result.link)
          .filter(link => link && link.length > 0)
          .slice(0, 5); // Limit to the first 5 URLs

          const answerBoxData = data.searchResults?.answerBox;
        
        if (urls.length > 0) {
          try {
            const schemaRequest = JSON.parse(JSON.stringify(schema, null, 2)) as JsonSchema
            
            // Call the extract mutation with the URLs, query, and schema
            extractMutation.mutate({
              urls,
              prompt: query,
              schema: schemaRequest,
              answerBoxData
            });
          } catch (error) {
            console.error("Failed to convert schema or extract data:", error);
          }
        }
      }
    },
    onError: (error) => {
      console.error("Search mutation error:", error);
    }
  });

  // Schema generation mutation
  const generateSchemaMutation = api.generateSchema.useMutation({
    onSuccess: (data: SchemaResult) => {
      console.log("Schema generation successful");
      console.log("Generated schema:", data.schema);
      setSchema(data.schema);
      
      console.log("About to trigger search mutation");
      searchMutation.mutate({
        query,
        // limit: 5
      });
      console.log("Search mutation triggered");
    },
    onError: (error) => {
      console.error("Schema generation error:", error);
    }
  });

  const handleGenerateSchema = () => {
    generateSchemaMutation.mutate({ query });
  };

  return (
    <div className="flex flex-col p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">JSON Schema Generator</h1>
      
      <div className="mb-4">
        <label htmlFor="query" className="block mb-2 font-medium">
          Data Description
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-md h-32"
          placeholder="Describe the data structure you need..."
        />
      </div>
      
      <button
        onClick={handleGenerateSchema}
        disabled={generateSchemaMutation.isPending || searchMutation.isPending || extractMutation.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4 disabled:bg-blue-400"
      >
        {generateSchemaMutation.isPending 
          ? "Generating Schema..." 
          : searchMutation.isPending 
            ? "Searching..." 
            : extractMutation.isPending
              ? "Extracting Data..."
              : "Generate Schema"}
      </button>
      
      {(generateSchemaMutation.error ?? searchMutation.error ?? extractMutation.error) && (
        <div className="text-red-500 mb-4">
          {generateSchemaMutation.error?.message ?? searchMutation.error?.message ?? extractMutation.error?.message}
        </div>
      )}
      
      {schema && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Schema</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </div>
      )}
      
      {searchResults?.searchResults && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Related Search Results</h2>
          {searchResults.searchResults.organic && (
            <ul className="space-y-3">
              {searchResults.searchResults.organic.map((result, index) => (
                <li key={index} className="border-b pb-2">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                    {result.title}
                  </a>
                  <p className="text-sm text-gray-600">{result.snippet}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {extractedData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Extracted Data</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(extractedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}