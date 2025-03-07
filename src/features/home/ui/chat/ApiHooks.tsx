// hooks/useApiWorkflow.ts
"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { type JsonSchema } from "@/utils/convert-json-to-zod";

// Define output types from your router
type RouterOutputs = inferRouterOutputs<AppRouter>;
type SearchResult = RouterOutputs["search"];
type SchemaResult = RouterOutputs["generateSchema"];
type ExtractResult = RouterOutputs["extract"];
type DeployResult = RouterOutputs["deploy"];
type ChatListResult = RouterOutputs["chat"]["list"];

// Define chat item structure
type ChatItem = {
  id: string;
  endpoint: string;
  name: string;
  query: string;
  lastUpdated: string;
  url: string;
};

// Define workflow steps
export enum WorkflowStep {
  Idle = "idle",
  SchemaGeneration = "schemaGeneration",
  Search = "search",
  Extraction = "extraction",
  Deployment = "deployment",
  Completed = "completed",
}

export function useApiWorkflow(userId: string) {
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false);

  // Chat/session state
  const [chatStart, setChatStart] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [model, setModel] = useState("gemini");

  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(
    WorkflowStep.Idle,
  );
  const [query, setQuery] = useState("");
  const [schema, setSchema] = useState<SchemaResult["schema"] | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractResult | null>(
    null,
  );
  const [deploymentData, setDeploymentData] = useState<DeployResult | null>(
    null,
  );

  // Error state
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch chat list
  const chatListQuery = api.chat.list.useQuery(
    { userId },
    {
      // Only fetch on initial load and when explicitly requested
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    },
  );

  // Handle the result with a useEffect
  useEffect(() => {
    // Handle successful data fetch
    if (chatListQuery.data) {
      if (chatListQuery.data.success && chatListQuery.data.endpoints) {
        const formattedChats: ChatItem[] = chatListQuery.data.endpoints.map(
          (endpoint, index) => ({
            id: `${index}-${endpoint.endpoint}`,
            endpoint: endpoint.endpoint,
            name: endpoint.name,
            query: endpoint.query,
            lastUpdated: endpoint.lastUpdated,
            url: endpoint.url,
          }),
        );
        setChats(formattedChats);
      } else {
        // Handle case where data exists but doesn't have expected structure
        setChats([]);
      }
    }

    // Update loading state based on query status
    setIsLoadingChats(chatListQuery.isLoading);

    // Handle error state
    if (chatListQuery.error) {
      console.error("Error fetching chats:", chatListQuery.error);
      setChats([]);
    }
  }, [chatListQuery.data, chatListQuery.error, chatListQuery.isLoading]);

  // Step 3: Extract data mutation
  const extractMutation = api.extract.useMutation({
    onSuccess: (data: ExtractResult) => {
      console.log("Extraction successful:", data);
      setExtractedData(data);
      setCurrentStep(WorkflowStep.Extraction);
    },
    onError: (error) => {
      console.error("Extraction error:", error);
      setWorkflowError(`Extraction failed: ${error.message}`);
      setCurrentStep(WorkflowStep.Idle);
    },
  });

  // Step 2: Search mutation
  const searchMutation = api.search.useMutation({
    onSuccess: (data: SearchResult) => {
      console.log("Search results:", data);
      setSearchResults(data);
      setCurrentStep(WorkflowStep.Search);

      // If we have a schema and search results, perform extraction
      if (schema && data.searchResults?.organic) {
        // Get URLs from search results
        const urls = data.searchResults.organic
          .map((result) => result.link)
          .filter((link) => link && link.length > 0)
          .slice(0, 5); // Limit to the first 5 URLs

        const answerBoxData = data.searchResults?.answerBox;

        if (urls.length > 0) {
          try {
            setCurrentStep(WorkflowStep.Extraction);
            const schemaRequest = JSON.parse(
              JSON.stringify(schema, null, 2),
            ) as JsonSchema;

            // Call the extract mutation with the URLs, query, and schema
            extractMutation.mutate({
              urls,
              prompt: query,
              schema: schemaRequest,
              answerBoxData,
            });
          } catch (error) {
            console.error("Failed to convert schema or extract data:", error);
            setWorkflowError("Failed to convert schema or extract data");
          }
        } else {
          setWorkflowError("No valid URLs found in search results");
        }
      }
    },
    onError: (error) => {
      console.error("Search mutation error:", error);
      setWorkflowError(`Search failed: ${error.message}`);
      setCurrentStep(WorkflowStep.Idle);
    },
  });

  // Step 1: Schema generation mutation
  const generateSchemaMutation = api.generateSchema.useMutation({
    onSuccess: (data: SchemaResult) => {
      console.log("Schema generation successful");
      console.log("Generated schema:", data.schema);
      setSchema(data.schema);
      setCurrentStep(WorkflowStep.SchemaGeneration);

      // Automatically trigger search after a short delay
      setTimeout(() => {
        searchMutation.mutate({
          query,
        });
      }, 1500);
    },
    onError: (error) => {
      console.error("Schema generation error:", error);
      setWorkflowError(`Schema generation failed: ${error.message}`);
      setCurrentStep(WorkflowStep.Idle);
    },
  });

  // Step 4: Deploy API mutation
  const deployMutation = api.deploy.useMutation({
    onSuccess: (data) => {
      console.log("Deployment successful:", data);
      setDeploymentData(data);

      // Add a delay to ensure the Deployment step is visible before completing
      setTimeout(() => {
        setCurrentStep(WorkflowStep.Completed);
      }, 1500);

      // Refresh chat list after successful deployment
      void chatListQuery.refetch().catch((error) => {
        console.error("Error refetching chat list:", error);
      });
    },
    onError: (error) => {
      console.error("Deployment error:", error);
      setWorkflowError(`Deployment failed: ${error.message}`);
    },
  });

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    // For now we're not fetching chat details
    // You could add chat.get query here if needed
  };

  const handleNewChat = () => {
    setChatStart(false);
    setCurrentStep(WorkflowStep.Idle);
    setSchema(null);
    setSearchResults(null);
    setExtractedData(null);
    setDeploymentData(null);
    setWorkflowError(null);
    setSelectedChatId(null);
    setQuery("");
  };

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startWorkflow();
  };

  const startWorkflow = () => {
    if (!query.trim()) {
      setWorkflowError("Please enter a query to generate an API");
      return;
    }

    setChatStart(true);
    setWorkflowError(null);
    setCurrentStep(WorkflowStep.SchemaGeneration);
    generateSchemaMutation.mutate({ query });
  };

  const resetWorkflow = () => {
    setChatStart(false);
    setCurrentStep(WorkflowStep.Idle);
    setSchema(null);
    setSearchResults(null);
    setExtractedData(null);
    setDeploymentData(null);
    setWorkflowError(null);
  };

  return {
    isClient,
    chatStart,
    setChatStart,
    selectedChatId,
    isLoadingChats,
    chats,
    model,
    setModel,
    currentStep,
    setCurrentStep,
    query,
    schema,
    searchResults,
    extractedData,
    deploymentData,
    workflowError,
    chatListQuery,
    extractMutation,
    searchMutation,
    generateSchemaMutation,
    deployMutation,
    handleSelectChat,
    handleNewChat,
    handleChange,
    handleSubmit,
    resetWorkflow,
  };
}
