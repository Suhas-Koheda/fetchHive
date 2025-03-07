// components/WelcomeScreen.tsx
"use client";

import React from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { ModelSelector } from "./ModelSelector";

interface WelcomeScreenProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (value: string) => void;
  placeholders: string[];
  model: string;
  setModel: (value: string) => void;
  isPending: boolean;
  workflowError: string | null;
}

export function WelcomeScreen({
  handleSubmit,
  handleChange,
  placeholders,
  model,
  setModel,
  isPending,
  workflowError,
}: WelcomeScreenProps) {
  return (
    <div className="z-10 mx-auto flex max-w-4xl flex-col p-4 pt-16 md:p-8 md:pt-8">
      <h1 className="mb-12 text-3xl font-light opacity-50">
        What can Fetch Hive help you with today?
      </h1>

      <PlaceholdersAndVanishInput
        onSubmit={handleSubmit}
        placeholders={placeholders}
        onChange={(e) => handleChange(e.target.value)}
      />

      <div className="mb-4 flex w-full items-center justify-between text-white">
        <div className="flex h-12 w-full items-center justify-between rounded-b-xl bg-[#282828] p-12 px-10 font-bold text-[#6687ae]">
          <ModelSelector model={model} setModel={setModel} />
          <InteractiveHoverButton
            type="submit"
            disabled={isPending}
            className="w-fit"
          >
            {isPending ? "Generating..." : "Generate API"}
          </InteractiveHoverButton>
        </div>
      </div>

      {workflowError && (
        <div className="mb-4 bg-[#16171c] text-red-500">{workflowError}</div>
      )}
    </div>
  );
}
