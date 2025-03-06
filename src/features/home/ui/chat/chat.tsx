"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { type JsonSchema } from "@/utils/convert-json-to-zod";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Plus, Settings, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Stepper, StepperStep } from "./Stepper"; // Import the new Stepper component

// Import step components
import { SchemaGenerated } from "@/features/chat/components/schema-generated";
import { SearchResults } from "@/features/chat/components/search-results";
import { Extraction } from "@/features/chat/components/extraction";
import { DeployApi } from "@/features/chat/components/deploy-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
enum WorkflowStep {
  Idle = "idle",
  SchemaGeneration = "schemaGeneration",
  Search = "search",
  Extraction = "extraction",
  Deployment = "deployment",
  Completed = "completed"
}

export default function ApiWorkflowPage({ userId }: {
  userId: string
}) {
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false);
  
  // Chat/session state
  const [chatStart, setChatStart] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [model, setModel] = useState("gemini");
  
  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(WorkflowStep.Idle);
  const [query, setQuery] = useState("");
  const [schema, setSchema] = useState<SchemaResult["schema"] | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractResult | null>(null);
  const [deploymentData, setDeploymentData] = useState<DeployResult | null>(null);
  
  // Error state
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  // Define stepper steps
  const stepperSteps: StepperStep[] = [
    { key: WorkflowStep.SchemaGeneration, label: "Schema Generation", description: "Creating data structure" },
    { key: WorkflowStep.Search, label: "Search", description: "Finding data sources" },
    { key: WorkflowStep.Extraction, label: "Data Extraction", description: "Processing data" },
    { key: WorkflowStep.Deployment, label: "API Deployment", description: "Building endpoints" },
  ];

  const placeholders = [
    "Generate an API for stock price data",
    "Create a weather API for my location",
    "Build an API for cryptocurrency market data",
    "Make a news API for tech updates",
  ];

  // Fetch chat list
  const chatListQuery = api.chat.list.useQuery({ userId });

  // Handle the result with a useEffect
  useEffect(() => {
    if (chatListQuery.data) {
      if (chatListQuery.data.success && chatListQuery.data.endpoints) {
        const formattedChats: ChatItem[] = chatListQuery.data.endpoints.map((endpoint, index) => ({
          id: `${index}-${endpoint.endpoint}`,
          endpoint: endpoint.endpoint,
          name: endpoint.name,
          query: endpoint.query,
          lastUpdated: endpoint.lastUpdated,
          url: endpoint.url
        }));
        setChats(formattedChats);
      }
      setIsLoadingChats(false);
    }
    
    if (chatListQuery.error) {
      console.error("Error fetching chats:", chatListQuery.error);
      setIsLoadingChats(false);
    }
  }, [chatListQuery.data, chatListQuery.error]);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    }
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
          .map(result => result.link)
          .filter(link => link && link.length > 0)
          .slice(0, 5); // Limit to the first 5 URLs

        const answerBoxData = data.searchResults?.answerBox;
        
        if (urls.length > 0) {
          try {
            setCurrentStep(WorkflowStep.Extraction);
            const schemaRequest = JSON.parse(JSON.stringify(schema, null, 2)) as JsonSchema;
            
            // Call the extract mutation with the URLs, query, and schema
            extractMutation.mutate({
              urls,
              prompt: query,
              schema: schemaRequest,
              answerBoxData
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
    }
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
          query
        });
      }, 1500);
    },
    onError: (error) => {
      console.error("Schema generation error:", error);
      setWorkflowError(`Schema generation failed: ${error.message}`);
      setCurrentStep(WorkflowStep.Idle);
    }
  });

  // Step 4: Deploy API mutation - FIXED to maintain Deployment state
  const deployMutation = api.deploy.useMutation({
    onSuccess: (data) => {
      console.log("Deployment successful:", data);
      setDeploymentData(data);
      
      // Add a delay to ensure the Deployment step is visible before completing
      setTimeout(() => {
        setCurrentStep(WorkflowStep.Completed);
      }, 1500);
      
      // Refresh chat list after successful deployment
      void chatListQuery.refetch().catch(error => {
        console.error("Error refetching chat list:", error);
      });
    },
    onError: (error) => {
      console.error("Deployment error:", error);
      setWorkflowError(`Deployment failed: ${error.message}`);
      // Keep the current step as Deployment on error
    }
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

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  // Only render the component content after client-side hydration
  if (!isClient) {
    return <div className="flex h-screen bg-black"></div>; // Simple loading state
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#16161d] overflow-hidden w-screen">
        <Sidebar>
          <SidebarHeader>
          <InteractiveHoverButton className="text-white"><Link href={"/"}>FetchHive</Link></InteractiveHoverButton>
            <SidebarMenuButton 
              size="lg" 
              onClick={handleNewChat}
              className="w-full justify-start gap-2 bg-[#16161d] text-white transition-all duration-300 hover:bg-white hover:scale-[1.02]"
            >
              <Plus size={16} />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarHeader>

          <SidebarContent className="overflow-y-auto">
            <div className="px-2 py-1 text-xs font-medium text-gray-400">Recent APIs</div>
            <SidebarMenu>
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                </div>
              ) : chats.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400">
                  No APIs created yet
                </div>
              ) : (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id} className="px-2">
                    <SidebarMenuButton
                      isActive={selectedChatId === chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full justify-start px-4 py-3 h-16 transition-all duration-300 ${
                        selectedChatId === chat.id 
                          ? "bg-gray-700" 
                          : "hover:bg-white hover:scale-[1.02]"
                      }`}
                    >
                      <MessageSquare size={16} className="transition-transform duration-300 group-hover:scale-110 mr-2 -ml-1" />
                      <div className="flex flex-1 flex-col overflow-hidden overflow-y-visible justify-around h-full">
                        <span className="truncate">{chat.name}</span>
                        <span className="text-xs text-gray-400">{formatDate(chat.lastUpdated)}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden w-full">
          <div className="fixed left-4 top-4 z-50 md:hidden">
            <SidebarTrigger />
          </div>

          <AuroraBackground className="z-0 bg-black text-white flex-1 overflow-y-auto w-full">
            {!chatStart ? (
              <div className="z-10 mx-auto flex max-w-4xl flex-col p-4 pt-16 md:p-8 md:pt-8">
                <h1 className="mb-12 text-3xl font-light opacity-50">What can Fetch Hive help you with today?</h1>
                
                <PlaceholdersAndVanishInput
                  onSubmit={handleSubmit}
                  placeholders={placeholders}
                  onChange={(e) => handleChange(e.target.value)}
                />
                
                <div className="mb-4 w-full flex items-center justify-between text-white">
                  <div className="h-12 p-12 w-full rounded-b-xl bg-[#282828] font-bold items-center flex justify-between px-10 text-[#6687ae]">
                    <div className="flex items-center">
                      Choose Model
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger className="mx-4 w-fit">
                          <SelectValue placeholder="Gemini"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="gemini">Gemini</SelectItem>
                            <SelectItem value="openAIo3">openAI-o3</SelectItem>
                            <SelectItem value="deepseek">Deepseek r3</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <InteractiveHoverButton 
                      type="submit"
                      disabled={generateSchemaMutation.isPending}
                      className="w-fit"
                    >
                      {generateSchemaMutation.isPending ? "Generating..." : "Generate API"}
                    </InteractiveHoverButton>
                  </div>
                </div>
                
                {workflowError && (
                  <div className="mb-4 text-red-500 bg-[#16171c]">{workflowError}</div>
                )}
              </div>
            ) : (
              <div className="z-10 mx-auto flex flex-col p-6 min-h-full w-full py-16">
                
                {/* Stepper component with properly tracked current step */}
                <Stepper 
                  steps={stepperSteps}
                  currentStep={currentStep}
                  className="mb-6"
                />
                
                {workflowError && (
                  <div className="flex justify-center">
                  <div className="mb-6 w-1/2 rounded-md bg-[#16171c] p-4 text-red-500">
                    <h3 className="font-semibold">Error</h3>
                    <p>{workflowError}</p>
                  </div>
                  </div>
                )}
                
                {/* Workflow Stages */}
                <div className="">
                  {/* Stage 1: Schema Generation */}
                  {currentStep === WorkflowStep.SchemaGeneration && generateSchemaMutation.isPending && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-12">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      <p className="text-lg">Generating Schema for your API...</p>
                      <p className="text-sm text-gray-400">Analyzing your request and creating a data structure</p>
                    </div>
                  )}
                  
                  {currentStep === WorkflowStep.SchemaGeneration && schema && !generateSchemaMutation.isPending && (
                    <SchemaGenerated schema={schema} />
                  )}
                  
                  {/* Stage 2: Search */}
                  {currentStep === WorkflowStep.Search && searchMutation.isPending && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-12">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      <p className="text-lg">Searching for relevant data sources...</p>
                      <p className="text-sm text-gray-400">Finding the best sources to power your API</p>
                    </div>
                  )}
                  
                  {currentStep === WorkflowStep.Search && searchResults && !searchMutation.isPending && (
                    <SearchResults data={searchResults} />
                  )}
                  
                  {/* Stage 3: Extraction */}
                  {currentStep === WorkflowStep.Extraction && extractMutation.isPending && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-12">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      <p className="text-lg">Extracting data from sources...</p>
                      <p className="text-sm text-gray-400">Transforming web data into structured API responses</p>
                    </div>
                  )}
                  
                  {currentStep === WorkflowStep.Extraction && extractedData && !extractMutation.isPending && (
                    <Extraction data={extractedData} />
                  )}
                  
                  {/* Stage 4: Deployment - FIXED to properly show deployment state */}
                  {currentStep === WorkflowStep.Deployment && deployMutation.isPending && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-12">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      <p className="text-lg">Deploying your API...</p>
                      <p className="text-sm text-gray-400">Setting up endpoints and documentation</p>
                    </div>
                  )}
                  
                  {/* Show deployment progress when in deployment step but not pending */}
                  {currentStep === WorkflowStep.Deployment && !deployMutation.isPending && deploymentData && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-12">
                      <div className="text-xl font-bold text-green-500">Deployment in progress!</div>
                      <p className="text-lg">Setting up your API endpoints and documentation...</p>
                      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Stage 5: Completed */}
                  {currentStep === WorkflowStep.Completed && deploymentData && (
                    <DeployApi deploymentData={deploymentData} />
                  )}
                  
                  {/* Navigation Controls */}
                  {currentStep !== WorkflowStep.Idle && (
                    <div className="flex flex-col space-y-2 items-center pt-6 pb-8">
                      <button
                        onClick={() => {
                          setChatStart(false);
                          setCurrentStep(WorkflowStep.Idle);
                          setSchema(null);
                          setSearchResults(null);
                          setExtractedData(null);
                          setDeploymentData(null);
                          setWorkflowError(null);
                        }}
                        className="px-4 py-2 rounded-md bg-gray-700 text-white flex justify-center hover:bg-gray-600"
                      >
                        Start Over
                      </button>
                      
                      {/* FIXED: Only show the Deploy API button when in Extraction step */}
                      {currentStep === WorkflowStep.Extraction && extractedData && (
                        <button
                          onClick={() => {
                            // Set the current step to Deployment first
                            setCurrentStep(WorkflowStep.Deployment);
                            
                            // Then trigger the deploy mutation
                            deployMutation.mutate({
                              userId,
                              schema,
                              extractedData,
                              name: `${query.slice(0, 20)}-api`,
                              query,
                              urls: searchResults?.searchResults?.organic 
                                ? searchResults.searchResults.organic
                                    .map((result: { link: string }) => result.link)
                                    .filter((link: string) => link && link.length > 0)
                                    .slice(0, 5)
                                : []
                            });
                          }}
                          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500"
                        >
                          Deploy API
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </AuroraBackground>
        </main>
      </div>
    </SidebarProvider>
  );
}