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
  const {
    data: apiDetails,
    isLoading,
    error,
  } = api.chat.get.useQuery(
    { userId, endpoint: apiEndpoint },
    { enabled: !!userId && !!apiEndpoint },
  );

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(type);
        setTimeout(() => {
          setCopied(null);
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to copy text to clipboard:", error);
      });
  };

  const formatJson = (obj: Record<string, any> | null | undefined) => {
    if (!obj) return "{}";
    return JSON.stringify(obj, null, 2);
  };

  if (isLoading) {
    return (
      <AuroraBackground className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen flex-col items-center justify-center">
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

          <Card className="border border-red-500/50 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-500">Error Loading API</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error?.message ?? "Failed to load API details"}</p>
              <InteractiveHoverButton
                onClick={() => router.push("/")}
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
          <h1 className="flex items-center text-2xl font-bold">
            {apiEndpoint}
            <Badge
              variant="outline"
              className="ml-4 border-green-400 text-green-400"
            >
              LIVE
            </Badge>
          </h1>
          <p className="mt-2 text-gray-400">
            {apiData.metadata?.query || "Generated API"}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">API Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2 rounded-lg bg-gray-900 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">API Endpoint:</span>
                  <button
                    onClick={() => copyToClipboard(apiDetails.url, "url")}
                    className="flex items-center text-blue-400 hover:text-blue-300"
                  >
                    {copied === "url" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                    <span className="ml-1 text-xs">
                      {copied === "url" ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
                <div className="flex items-center">
                  <code className="w-full overflow-x-auto whitespace-nowrap font-mono text-green-400">
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

              <div className="rounded-lg bg-gray-900 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">cURL Command:</span>
                  <button
                    onClick={() => copyToClipboard(curlCommand, "curl")}
                    className="flex items-center text-blue-400 hover:text-blue-300"
                  >
                    {copied === "curl" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                    <span className="ml-1 text-xs">
                      {copied === "curl" ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded bg-black bg-opacity-50 p-2 font-mono text-sm text-yellow-400">
                  {curlCommand}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="data" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="data">Data Example</TabsTrigger>
                  <TabsTrigger value="schema">Schema</TabsTrigger>
                  <TabsTrigger value="full">Full Response</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="mt-2">
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(dataExample, "data")}
                      className="absolute right-2 top-2 flex items-center text-blue-400 hover:text-blue-300"
                    >
                      {copied === "data" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <pre className="max-h-80 overflow-auto rounded-lg bg-black bg-opacity-50 p-4 font-mono text-xs text-gray-300">
                      {dataExample}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="schema" className="mt-2">
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(schemaContent, "schema")}
                      className="absolute right-2 top-2 flex items-center text-blue-400 hover:text-blue-300"
                    >
                      {copied === "schema" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <pre className="max-h-80 overflow-auto rounded-lg bg-black bg-opacity-50 p-4 font-mono text-xs text-gray-300">
                      {schemaContent}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="full" className="mt-2">
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(fullResponse, "full")}
                      className="absolute right-2 top-2 flex items-center text-blue-400 hover:text-blue-300"
                    >
                      {copied === "full" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <pre className="max-h-80 overflow-auto rounded-lg bg-black bg-opacity-50 p-4 font-mono text-xs text-gray-300">
                      {fullResponse}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-gray-300">
                {apiData.metadata?.sources?.map(
                  (source: string, index: number) => (
                    <li key={index} className="my-1 truncate">
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {source}
                      </a>
                    </li>
                  ),
                ) || <li>No sources available</li>}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between">
            <div className="text-sm text-gray-400">
              <div>
                Created:{" "}
                {new Date(
                  apiData.config?.createdAt || apiData.metadata?.lastUpdated,
                ).toLocaleString()}
              </div>
              <div>
                Last Updated:{" "}
                {new Date(apiData.metadata?.lastUpdated).toLocaleString()}
              </div>
            </div>

            <InteractiveHoverButton
              onClick={() => window.open(apiDetails.url, "_blank")}
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
