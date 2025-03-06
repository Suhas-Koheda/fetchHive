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

export function DeployApi({ deploymentData }: { deploymentData: DeployResult }) {
  const [copied, setCopied] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => {
        setCopied(null);
      }, 2000);
    }).catch(error => {
      console.error('Failed to copy text to clipboard:', error);
    });
  };

  useEffect(() => {
    // Reset copied state when deploymentData changes
    setCopied(null);
  }, [deploymentData]);

  if (!deploymentData?.success) {
    return (
      <Card className="bg-red-500/10 border border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-500">Deployment Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{deploymentData?.message || "Something went wrong during deployment."}</p>
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
    <Card className="bg-gray-800 border border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-green-400">API Deployed Successfully! 🚀</CardTitle>
          <Badge variant="outline" className="text-green-400 border-green-400">LIVE</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">API Endpoint:</span>
              <button 
                onClick={() => copyToClipboard(deploymentData.url, 'url')}
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                {copied === 'url' ? <CheckCircle size={14} /> : <Copy size={14} />}
                <span className="ml-1 text-xs">{copied === 'url' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex items-center">
              <code className="font-mono text-green-400 overflow-x-auto whitespace-nowrap w-full">
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
          
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-gray-400">cURL Command:</span>
              <button 
                onClick={() => copyToClipboard(deploymentData.curlCommand, 'curl')}
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                {copied === 'curl' ? <CheckCircle size={14} /> : <Copy size={14} />}
                <span className="ml-1 text-xs">{copied === 'curl' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-sm text-yellow-400 mt-2 overflow-x-auto p-2 bg-black bg-opacity-50 rounded">
              {deploymentData.curlCommand}
            </pre>
          </div>
          
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
          
          <div className="flex flex-col space-y-2">
            <span className="text-gray-400">Data Sources:</span>
            <ul className="list-disc list-inside text-sm text-gray-300">
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
          
          <div className="flex justify-between mt-6">
            <div className="text-sm text-gray-400">
              <div>Created: {new Date(deploymentData.apiData.config.createdAt).toLocaleString()}</div>
              <div>Last Updated: {new Date(deploymentData.apiData.metadata.lastUpdated).toLocaleString()}</div>
            </div>
            
            <InteractiveHoverButton
              onClick={() => window.open(deploymentData.url, '_blank')}
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