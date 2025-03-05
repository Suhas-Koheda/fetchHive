"use client"
import React from "react";
import {Compare} from "@/features/home/ui/compare/Compare";

export function CompareComponent() {
    return (
        <div className="p-4 flex flex-col items-center bg-[#030617] dark:bg-neutral-900 dark:border-neutral-800 ">
            <h2 className="text-2xl font-bold text-center mb-4 text-neutral-800 dark:text-white text-white heading">
                What You Can Expect From Us
            </h2>
            <Compare
                firstImage="https://us1.discourse-cdn.com/openai1/original/4X/7/5/c/75c39c30b04e2ae451cdc52e1c002c592442e6b8.png"
                secondImage="https://media.geeksforgeeks.org/wp-content/uploads/20240229152843/Screenshot-2024-02-29-152809.png"
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="h-[250px] md:h-[500px] md:w-[500px]"
                slideMode="hover"
            />
        </div>
    );
}

export default CompareComponent;