"use client";
import React from "react";
import { Compare } from "@/features/home/ui/compare/Compare";

export function CompareComponent() {
  return (
    <div className="flex flex-col items-center bg-[#030617] p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="heading mb-4 text-center text-2xl font-bold text-white dark:text-white">
        What You Can Expect From Us
      </h2>
      <Compare
        firstImage="https://us1.discourse-cdn.com/openai1/original/4X/7/5/c/75c39c30b04e2ae451cdc52e1c002c592442e6b8.png"
        secondImage="https://i.ibb.co/qMScfcfC/Screenshot-from-2025-03-07-08-25-29.png"
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-[300px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
}

export default CompareComponent;