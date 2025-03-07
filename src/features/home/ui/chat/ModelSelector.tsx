// components/ModelSelector.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  model: string;
  setModel: (value: string) => void;
}

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  return (
    <div className="flex items-center">
      Choose Model
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger className="mx-4 w-fit">
          <SelectValue placeholder="Gemini" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="gemini">Gemini</SelectItem>
            <SelectItem value="openAIo3">openAI-o3</SelectItem>
            <SelectItem value="deepseek">Deepseek r3</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
