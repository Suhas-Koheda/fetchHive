"use client";
import React, { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Cover } from "@/components/ui/cover";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";

export function SpotlightClient() {
  return (
    <div className="bg-grid-white/[0.02] relative flex h-[75dvh] w-full flex-col items-center overflow-hidden bg-[#030617] antialiased md:h-screen md:flex-row md:items-center md:justify-around">
      <Spotlight
        className="absolute -top-40 left-0 z-20 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Build Backend APIs <br />
          the Easy Way
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
          Generate powerful, real-time APIs in seconds without writing complex
          backend code
        </p>
      </div>
      <div className="flex w-3/4 justify-center">
        <div className="flex h-[30dvh] flex-col items-center justify-around">
          <Link href="/sign-up" className="z-10">
            <ShimmerButton className="group shadow-2xl">
              <span className="flex items-center space-x-2 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </ShimmerButton>
          </Link>
          <button className="group z-10 flex items-center space-x-2 rounded-full bg-white/10 px-6 py-3 text-white transition-all duration-300 hover:bg-white/20">
            <Play className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
            <span>Watch Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
