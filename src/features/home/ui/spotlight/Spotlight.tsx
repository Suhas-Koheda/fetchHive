"use client"
import React, { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Cover } from "@/components/ui/cover";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";

export function SpotlightClient() {
  
  return (
    <div
      className="h-[75dvh] md:h-screen w-full flex flex-col items-center md:flex-row md:items-center md:justify-around bg-[#030617] antialiased bg-grid-white/[0.02] relative overflow-hidden"
    >
      <Spotlight
        className="-top-40 absolute z-20 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Build Backend APIs <br />
          the Easy Way
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Generate powerful, real-time APIs in seconds without writing complex backend code
        </p>
      </div>
      <div className="w-3/4 flex justify-center">
        <div className="flex flex-col justify-around h-[30dvh] items-center">
          <Link href="/sign-up" className="z-10">
            <ShimmerButton className="shadow-2xl group">
              <span className="flex items-center space-x-2 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </ShimmerButton>
          </Link>
          <button
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 group z-10"
          >
            <Play className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            <span>Watch Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}