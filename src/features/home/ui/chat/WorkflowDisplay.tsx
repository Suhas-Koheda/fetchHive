// components/WorkflowDisplay.tsx
"use client";

import React from 'react';
import { SearchResults } from "@/features/chat/components/search-results";
import { Extraction } from "@/features/chat/components/extraction";
import { DeployApi } from "@/features/chat/components/deploy-api";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { StepperStep, Stepper } from './Stepper';
import { SchemaGenerated } from "@/features/chat/components/schema-generated";

// Define output types from your router
type RouterOutputs = inferRouterOutputs<AppRouter>;
type SearchResult = RouterOutputs["search"];
type SchemaResult = RouterOutputs["generateSchema"];
type ExtractResult = RouterOutputs["extract"];
type DeployResult = RouterOutputs["deploy"];

// Define workflow steps
enum WorkflowStep {
  Idle = "idle",
  SchemaGeneration = "schemaGeneration",
  Search = "search",
  Extraction = "extraction",
  Deployment = "deployment",
  Completed = "completed"
}

// Define the deploy params type based on the structure used in handleDeploy
interface DeployParams {
  userId: string;
  schema: SchemaResult["schema"] | null;
  extractedData: ExtractResult | null;
  name: string;
  query: string;
  urls: string[];
}

interface WorkflowDisplayProps {
  currentStep: WorkflowStep;
  setCurrentStep: (step: WorkflowStep) => void;
  workflowError: string | null;
  schema: SchemaResult["schema"] | null;
  searchResults: SearchResult | null;
  extractedData: ExtractResult | null;
  deploymentData: DeployResult | null;
  generateSchemaMutation: {
    isPending: boolean;
  };
  searchMutation: {
    isPending: boolean;
  };
  extractMutation: {
    isPending: boolean;
  };
  deployMutation: {
    isPending: boolean;
    mutate: (params: DeployParams) => void;
  };
  userId: string;
  query: string;
  resetWorkflow: () => void;
}

export function WorkflowDisplay({
                                  currentStep,
                                  setCurrentStep,
                                  workflowError,
                                  schema,
                                  searchResults,
                                  extractedData,
                                  deploymentData,
                                  generateSchemaMutation,
                                  searchMutation,
                                  extractMutation,
                                  deployMutation,
                                  userId,
                                  query,
                                  resetWorkflow
                                }: WorkflowDisplayProps) {

  // Define stepper steps
  const stepperSteps: StepperStep[] = [
    { key: WorkflowStep.SchemaGeneration, label: "Schema Generation", description: "Creating data structure" },
    { key: WorkflowStep.Search, label: "Search", description: "Finding data sources" },
    { key: WorkflowStep.Extraction, label: "Data Extraction", description: "Processing data" },
    { key: WorkflowStep.Deployment, label: "API Deployment", description: "Building endpoints" },
  ];

  const handleDeploy = () => {
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
  };

  return (
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

          {/* Stage 4: Deployment */}
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
                    onClick={resetWorkflow}
                    className="px-4 py-2 rounded-md bg-gray-700 text-white flex justify-center hover:bg-gray-600"
                >
                  Start Over
                </button>

                {/* Only show the Deploy API button when in Extraction step */}
                {currentStep === WorkflowStep.Extraction && extractedData && (
                    <button
                        onClick={handleDeploy}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500"
                    >
                      Deploy API
                    </button>
                )}
              </div>
          )}
        </div>
      </div>
  );
}