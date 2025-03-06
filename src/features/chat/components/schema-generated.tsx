/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

// The interface expected by your component
interface SchemaGeneratedSchema {
  type: string;
  description: string;
  properties: Record<string, { description: string }>;
}

// Updated props to handle the API response format
interface SchemaGeneratedProps {
  schema: Record<string, any>;
}

export const SchemaGenerated: React.FC<SchemaGeneratedProps> = ({ schema }) => {
  // Check if the schema matches the expected format
  if (!schema.type || !schema.description || !schema.properties) {
    return (
      <div className="p-4 border rounded shadow-md max-w-md mx-auto bg-red-50">
        <h2 className="text-xl font-bold mb-2 text-red-500">Invalid Schema Format</h2>
        <p className="text-sm text-gray-700">
          The provided schema doesn&apos;t match the expected format. Please ensure it includes type, description, and properties.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{schema.description}</h2>
      <p className="text-sm text-gray-700 mb-4">Type: {schema.type}</p>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(schema.properties).map(([key, property]) => {
          // Handle possible type differences in property
          const prop = property as { description?: string; type?: string };
          
          return (
            <div key={key} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{key}</span>
                {prop.type && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{prop.type}</span>}
              </div>
              <p className="text-sm text-gray-500">{prop.description ?? "No description available"}</p>
            </div>
          );
        })}
      </div>
      
      {/* Show required fields if available */}
      {schema.required && Array.isArray(schema.required) && schema.required.length > 0 && (
        <div className="mt-4 pt-2 border-t">
          <h3 className="font-semibold mb-1">Required Fields:</h3>
          <div className="flex flex-wrap gap-1">
            {schema.required.map((field: string) => (
              <span key={field} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {field}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};