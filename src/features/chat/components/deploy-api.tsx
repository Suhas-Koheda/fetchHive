/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Badge } from "@/components/ui/badge";

type DeployResult = {
  success: boolean;
  message: string;
  route: string;
  url: string;
  curlCommand: string;
  apiData: {
    data: Record<string, any>;
    metadata: {
      query: string;
      schema: Record<string, any>;
      sources: string[];
      lastUpdated: string;
    };
    config: {
      urls: string[];
      query: string;
      schema: Record<string, any>;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export function DeployApi({
  deploymentData,
}: {
  deploymentData: DeployResult;
}) {
  const [copied, setCopied] = useState<string | null>(null);

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

  useEffect(() => {
    // Reset copied state when deploymentData changes
    setCopied(null);
  }, [deploymentData]);

  if (!deploymentData?.success) {
    return (
      <Card className="h-32 border border-red-500/50 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Deployment Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {deploymentData?.message ||
              "Something went wrong during deployment."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatJson = (obj: Record<string, any>) => {
    return JSON.stringify(obj, null, 2);
  };

  const dataExample = formatJson(deploymentData.apiData.data);
  const fullResponse = formatJson(deploymentData.apiData);
  const schemaContent = formatJson(deploymentData.apiData.metadata.schema);

  return (
    <Card className="border border-gray-700 bg-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-green-400">
            API Deployed Successfully! 🚀
          </CardTitle>
          <Badge variant="outline" className="border-green-400 text-green-400">
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2 rounded-lg bg-gray-900 p-4">
            <div className="flex justify-between">
              <span className="text-gray-400">API Endpoint:</span>
              <button
                onClick={() => copyToClipboard(deploymentData.url, "url")}
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
                {deploymentData.url}
              </code>
              <a
                href={deploymentData.url}
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
                onClick={() =>
                  copyToClipboard(deploymentData.curlCommand, "curl")
                }
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
              {deploymentData.curlCommand}
            </pre>
          </div>

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

          <div className="flex flex-col space-y-2">
            <span className="text-gray-400">Data Sources:</span>
            <ul className="list-inside list-disc text-sm text-gray-300">
              {deploymentData.apiData.metadata.sources.map((source, index) => (
                <li key={index} className="truncate">
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-between">
            <div className="text-sm text-gray-400">
              <div>
                Created:{" "}
                {new Date(
                  deploymentData.apiData.config.createdAt,
                ).toLocaleString()}
              </div>
              <div>
                Last Updated:{" "}
                {new Date(
                  deploymentData.apiData.metadata.lastUpdated,
                ).toLocaleString()}
              </div>
            </div>

            <InteractiveHoverButton
              onClick={() => window.open(deploymentData.url, "_blank")}
              className="px-4 py-2"
            >
              Test API
            </InteractiveHoverButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
