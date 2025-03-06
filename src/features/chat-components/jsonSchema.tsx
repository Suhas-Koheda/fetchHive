import React from "react";

interface StockDataSchema {
  type: string;
  description: string;
  properties: Record<string, { description: string }>;
}

interface StockDataComponentProps {
  schema: StockDataSchema;
}

const StockDataComponent: React.FC<StockDataComponentProps> = ({ schema }) => {
  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{schema.description}</h2>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(schema.properties).map(([key, property]) => (
          <div key={key} className="border-b pb-2">
            <p className="text-sm text-gray-500">{property.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDataComponent;
