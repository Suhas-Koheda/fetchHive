/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, ChevronRight } from 'lucide-react';

// Generic type for any data structure
type SearchData = {
  [key: string]: any;
};

// Updated props to match your API response structure
type ExtractionProps = {
  data: {
    success: boolean;
    data?: SearchData;
    error?: string;
  };
};

// Helper to check if a value is an object (for nested rendering)
const isObject = (value: any): boolean => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

// Format values appropriately based on their type
const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') return value.toLocaleString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (isObject(value)) return '{...}';
  return String(value);
};

// Get a sensible label for the data type
const getDataTypeLabel = (data: SearchData): string => {
  if ('symbol' in data) return 'Stock';
  if ('temperature' in data) return 'Weather';
  if ('city' in data) return 'Location';
  if ('address' in data) return 'Address';
  if ('title' in data) return 'Content';
  if ('name' in data) return 'Entity';
  return 'Data';
};

// Determine an appropriate title from the data
const getTitle = (data: SearchData): string => {
  if (data.symbol) return data.symbol;
  if (data.city) return data.city;
  if (data.name) return data.name;
  if (data.title) return data.title;
  return 'Search Result';
};

export const Extraction = ({ data }: ExtractionProps) => {
  // Destructure the response
  const { success, data: searchData, error } = data;
  
  if (!success || !searchData) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gray-900 text-gray-100 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center text-red-400">{error ?? 'Failed to fetch data'}</div>
        </CardContent>
      </Card>
    );
  }

  // Extract answerBox if it exists
  const answerBox = searchData.answerBox;
  const mainData = { ...searchData };
  if (answerBox) delete mainData.answerBox;

  // Get data type and title
  const dataType = getDataTypeLabel(mainData);
  const title = getTitle(mainData);

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 text-gray-100 shadow-lg border-gray-800">
      {/* Answer Box (if available) */}
      {answerBox && (
        <CardHeader className="pb-2 border-b border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold">
                {answerBox.answer || answerBox.stockPrice || formatValue(Object.values(answerBox)[0])}
              </div>
              <div className="text-gray-400 text-sm">
                {answerBox.description || formatValue(Object.entries(answerBox)[1]?.[1])}
              </div>
            </div>
            <Badge variant="outline" className="bg-gray-800 text-white">
              <Info size={14} className="mr-1" /> Info
            </Badge>
          </div>
        </CardHeader>
      )}

      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <Badge className="bg-indigo-600 hover:bg-indigo-700">{dataType}</Badge>
          </div>
          
          {/* Primary Cards for Important Data */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(mainData).slice(0, 4).map(([key, value]) => {
              // Skip nested objects for the grid display
              if (isObject(value) || key === 'answerBox') return null;
              
              return (
                <div key={key} className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-400 text-xs">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div className="text-lg font-medium truncate">{formatValue(value)}</div>
                </div>
              );
            })}
          </div>
          
          {/* Additional Data as List Items */}
          <div className="mt-4 text-sm text-gray-400">
            {Object.entries(mainData).slice(4).map(([key, value]) => {
              // Skip nested objects for simple list
              if (isObject(value) || key === 'answerBox') return null;
              
              return (
                <div key={key} className="flex justify-between py-2 border-t border-gray-800">
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="font-medium text-gray-200">{formatValue(value)}</span>
                </div>
              );
            })}
          </div>
          
          {/* Nested Object Data */}
          {Object.entries(mainData).map(([key, value]) => {
            if (isObject(value) && key !== 'answerBox') {
              return (
                <div key={key} className="mt-4">
                  <div className="flex justify-between items-center py-2 border-t border-gray-800">
                    <span className="text-gray-400 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <Badge variant="outline" className="bg-gray-800">
                      <ChevronRight size={14} />
                    </Badge>
                  </div>
                  <div className="pl-2 border-l border-gray-800 mt-2 space-y-2">
                    {Object.entries(value).map(([nestedKey, nestedValue]) => (
                      <div key={nestedKey} className="flex justify-between py-1">
                        <span className="text-gray-400 text-sm">{nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1)}</span>
                        <span className="text-gray-200 text-sm">{formatValue(nestedValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </CardContent>
    </Card>
  );
};