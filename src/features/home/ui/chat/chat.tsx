"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";

export default function ChatPage() {
  // Use client-side only rendering to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [chatStart, setChatStart] = useState(false);
  const [query, setQuery] = useState("");
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const generateSchemaMutation = api.generateSchema.useMutation({
    onSuccess: (data) => {
      console.log("Generated schema:", data.schema);
    },
    onError: (error) => {
      console.error("Error generating schema:", error);
    }
  });
  
  const handleGenerateSchema = () => {
    setChatStart(true);
    generateSchemaMutation.mutate({ query });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  // Only render the component content after client-side hydration
  if (!isClient) {
    return <div className="flex h-screen bg-black"></div>; // Simple loading state
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarBody className="bg-[#262626] border-black">
          <div className="flex flex-col gap-2 text-white">
            Chat 1
          </div>
        </SidebarBody>
      </Sidebar>
      
      <main className="flex-1 overflow-auto">
        <AuroraBackground className="bg-black z-0 text-white min-h-screen">
          {!chatStart ? (
            <div className="flex z-10 flex-col p-4 max-w-4xl mx-auto">
              <h1 className="text-3xl font-light opacity-50 mb-12">What can Fetch Hive help you with today?</h1>

              <div className="mb-4">
                <input 
                  type="text" 
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Ask anything you want" 
                  className="w-full border-0 h-16 rounded-t-xl bg-[#282828] px-4" 
                />
                <div className="flex w-full text-[#1c2d41] font-bold pt-4 h-16 bg-[#282828] rounded-b-xl px-4">
                  Choose Model
                  <select className="bg-[#282828] text-gray-400 mb-6 ml-4 w-[15%]">
                    <option>Gemini</option>
                    <option>openAI-o3</option>
                    <option>Deepseek r3</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateSchema}
                className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4 cursor-pointer"
              >
                {generateSchemaMutation.isPending ? "Generating..." : "Generate Schema"}
              </button>

              {generateSchemaMutation.error && (
                <div className="text-red-500 mb-4">
                  {generateSchemaMutation.error.message}
                </div>
              )}
            </div>
          ) : (
            <div>Hello</div>
          )}
        </AuroraBackground>
      </main>
    </div>
  );
}