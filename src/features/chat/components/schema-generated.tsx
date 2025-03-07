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
  console.log(schema);

  // Check if the schema matches the expected format
  if (!schema.type || !schema.description || !schema.properties) {
    return (
      <div className="mx-auto max-w-md rounded border bg-red-50 p-4 shadow-md">
        <h2 className="mb-2 text-xl font-bold text-red-500">
          Invalid Schema Format
        </h2>
        <p className="text-sm text-gray-700">
          The provided schema doesn&apos;t match the expected format. Please
          ensure it includes type, description, and properties.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded border p-4 shadow-md">
      <h2 className="mb-2 text-xl font-bold">{schema.description}</h2>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(schema.properties).map(([key, property]) => {
          // Handle possible type differences in property
          const prop = property as { description?: string; type?: string };

          return (
            <div key={key} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{key}</span>
                {prop.type && (
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-black">
                    {prop.type}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {prop.description ?? "No description available"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Show required fields if available */}
      {schema.required &&
        Array.isArray(schema.required) &&
        schema.required.length > 0 && (
          <div className="mt-4 border-t pt-2">
            <h3 className="mb-1 font-semibold">Required Fields:</h3>
            <div className="flex flex-wrap gap-1">
              {schema.required.map((field: string) => (
                <span
                  key={field}
                  className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};
