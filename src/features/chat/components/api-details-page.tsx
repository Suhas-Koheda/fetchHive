/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Badge } from "@/components/ui/badge";

export default function ApiDetailsPage({ userId }: { userId: string }) {
  const router = useRouter();
  const params = useParams();
  const apiEndpoint = params.endpoint as string;
  const [copied, setCopied] = useState<string | null>(null);
  
  // Fetch API details
  const { data: apiDetails, isLoading, error } = api.chat.get.useQuery(
    { userId, endpoint: apiEndpoint },
    { enabled: !!userId && !!apiEndpoint }
  );

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => {
        setCopied(null);
      }, 2000);
    }).catch((error) => {
      console.error('Failed to copy text to clipboard:', error);
    });
  };

  const formatJson = (obj: Record<string, any> | null | undefined) => {
    if (!obj) return "{}";
    return JSON.stringify(obj, null, 2);
  };

  if (isLoading) {
    return (
      <AuroraBackground className="min-h-screen bg-black text-white">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg">Loading API details...</p>
        </div>
      </AuroraBackground>
    );
  }

  if (error || !apiDetails) {
    return (
      <AuroraBackground className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft size={16} className="mr-2" /> Back
          </button>
          
          <Card className="bg-red-500/10 border border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-500">Error Loading API</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error?.message ?? "Failed to load API details"}</p>
              <InteractiveHoverButton
                onClick={() => router.push('/')}
                className="mt-4"
              >
                Return to Dashboard
              </InteractiveHoverButton>
            </CardContent>
          </Card>
        </div>
      </AuroraBackground>
    );
  }

  const apiData = apiDetails.data;
  const curlCommand = `curl -X GET "${apiDetails.url}" \\\n  -H "Content-Type: application/json"`;
  const dataExample = formatJson(apiData.data);
  const schemaContent = formatJson(apiData.metadata?.schema);
  const fullResponse = formatJson(apiData);

  return (
    <AuroraBackground className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            {apiEndpoint}
            <Badge variant="outline" className="ml-4 text-green-400 border-green-400">LIVE</Badge>
          </h1>
          <p className="text-gray-400 mt-2">
            {apiData.metadata?.query || "Generated API"}
          </p>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">API Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-4 flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">API Endpoint:</span>
                  <button 
                    onClick={() => copyToClipboard(apiDetails.url, 'url')}
                    className="text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    {copied === 'url' ? <CheckCircle size={14} /> : <Copy size={14} />}
                    <span className="ml-1 text-xs">{copied === 'url' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="flex items-center">
                  <code className="font-mono text-green-400 overflow-x-auto whitespace-nowrap w-full">
                    {apiDetails.url}
                  </code>
                  <a 
                    href={apiDetails.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">cURL Command:</span>
                  <button 
                    onClick={() => copyToClipboard(curlCommand, 'curl')}
                    className="text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    {copied === 'curl' ? <CheckCircle size={14} /> : <Copy size={14} />}
                    <span className="ml-1 text-xs">{copied === 'curl' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-sm text-yellow-400 mt-2 overflow-x-auto p-2 bg-black bg-opacity-50 rounded">
                  {curlCommand}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="data" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="data">Data Example</TabsTrigger>
                  <TabsTrigger value="schema">Schema</TabsTrigger>
                  <TabsTrigger value="full">Full Response</TabsTrigger>
                </TabsList>
                
                <TabsContent value="data" className="mt-2">
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(dataExample, 'data')}
                      className="absolute top-2 right-2 text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      {copied === 'data' ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                    <pre className="font-mono text-xs text-gray-300 p-4 bg-black bg-opacity-50 rounded-lg overflow-auto max-h-80">
                      {dataExample}
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="schema" className="mt-2">
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(schemaContent, 'schema')}
                      className="absolute top-2 right-2 text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      {copied === 'schema' ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                    <pre className="font-mono text-xs text-gray-300 p-4 bg-black bg-opacity-50 rounded-lg overflow-auto max-h-80">
                      {schemaContent}
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="full" className="mt-2">
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(fullResponse, 'full')}
                      className="absolute top-2 right-2 text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      {copied === 'full' ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                    <pre className="font-mono text-xs text-gray-300 p-4 bg-black bg-opacity-50 rounded-lg overflow-auto max-h-80">
                      {fullResponse}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {apiData.metadata?.sources?.map((source: string, index: number) => (
                  <li key={index} className="truncate my-1">
                    <a 
                      href={source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {source}
                    </a>
                  </li>
                )) || <li>No sources available</li>}
              </ul>
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-6">
            <div className="text-sm text-gray-400">
              <div>Created: {new Date(apiData.config?.createdAt || apiData.metadata?.lastUpdated).toLocaleString()}</div>
              <div>Last Updated: {new Date(apiData.metadata?.lastUpdated).toLocaleString()}</div>
            </div>
            
            <InteractiveHoverButton
              onClick={() => window.open(apiDetails.url, '_blank')}
              className="px-4 py-2"
            >
              Test API
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}