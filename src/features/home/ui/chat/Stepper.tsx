"use client";

import { useState, useEffect } from "react";

export type StepperStep = {
  key: string;
  label: string;
  description?: string;
};

type StepperProps = {
  steps: StepperStep[];
  currentStep: string;
  className?: string;
};

export const Stepper = ({
  steps,
  currentStep,
  className = "",
}: StepperProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const index = steps.findIndex((step) => step.key === currentStep);
    setActiveIndex(index);
  }, [currentStep, steps]);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative mb-8">
        {/* Progress Bar */}
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-700"></div>
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-pink-500 transition-all duration-500"
          style={{
            width:
              activeIndex >= 0
                ? `${(activeIndex / (steps.length - 1)) * 100}%`
                : "0%",
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  index <= activeIndex
                    ? "bg-pink-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {index < activeIndex ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span></span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    index <= activeIndex ? "text-white" : "text-gray-400"
                  }`}
                ></p>
                {step.description && <p className="text-xs text-gray-500"></p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
