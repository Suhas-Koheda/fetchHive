// pages/ApiWorkflowPage.tsx
"use client";

import React from "react";
import { Menu, Plus } from "lucide-react";
import { useApiWorkflow } from "./ApiHooks";
import { SidebarComponent } from "./Sidebar";
import { WelcomeScreen } from "./WelcomeScreen";
import { WorkflowDisplay } from "./WorkflowDisplay";

import {
  SidebarTrigger,
  SidebarProvider,
  Sidebar,
} from "@/components/ui/sidebar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";

interface ApiWorkflowPageProps {
  userId: string;
}

export default function ApiWorkflowPage({ userId }: ApiWorkflowPageProps) {
  const {
    isClient,
    chatStart,
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
    extractMutation,
    searchMutation,
    generateSchemaMutation,
    deployMutation,
    handleSelectChat,
    handleNewChat,
    handleChange,
    handleSubmit,
    resetWorkflow,
  } = useApiWorkflow(userId);

  const placeholders = [
    "Generate an API for stock price data",
    "Create a weather API for my location",
    "Build an API for cryptocurrency market data",
    "Make a news API for tech updates",
  ];

  // Only render the component content after client-side hydration
  if (!isClient) {
    return <div className="flex h-screen bg-black"></div>; // Simple loading state
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#16161d]">
        {/* Sidebar that will collapse on mobile */}
        <Sidebar className="border-r border-gray-800">
          <SidebarComponent
            chats={chats}
            isLoadingChats={isLoadingChats}
            selectedChatId={selectedChatId}
            handleSelectChat={handleSelectChat}
            handleNewChat={handleNewChat}
            userId={userId}
          />
        </Sidebar>

        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {/* Mobile header with trigger */}
          <div className="flex items-center justify-between border-b border-gray-800 bg-[#16161d] p-4 md:hidden">
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu />
              </Button>
            </SidebarTrigger>

            <span className="text-xl font-bold text-white">FetchHive</span>

            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={handleNewChat}
            >
              <Plus />
            </Button>
          </div>

          <AuroraBackground className="z-0 w-full flex-1 overflow-y-auto bg-black text-white">
            {!chatStart ? (
              <WelcomeScreen
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                placeholders={placeholders}
                model={model}
                setModel={setModel}
                isPending={generateSchemaMutation.isPending}
                workflowError={workflowError}
              />
            ) : (
              <WorkflowDisplay
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                workflowError={workflowError}
                schema={schema}
                searchResults={searchResults}
                extractedData={extractedData}
                deploymentData={deploymentData}
                generateSchemaMutation={generateSchemaMutation}
                searchMutation={searchMutation}
                extractMutation={extractMutation}
                deployMutation={deployMutation}
                userId={userId}
                query={query}
                resetWorkflow={resetWorkflow}
              />
            )}
          </AuroraBackground>
        </main>
      </div>
    </SidebarProvider>
  );
}
