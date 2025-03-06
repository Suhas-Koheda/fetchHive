/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";


export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }, 400);
    }, 3000);
  }, [placeholders.length]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startAnimation, handleVisibilityChange]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      className={cn(
        "w-full flex relative max-w-3xl mx-auto text-white bg-[#282828] dark:bg-zinc-800 h-12 rounded-t-xl overflow-hidden shadow transition duration-200",
        value && "bg-[#282828]"
      )}
      onSubmit={handleSubmit}
    >
      <div className="relative h-full">
        {value === "" && (
          <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 pointer-events-none w-4/5 overflow-hidden h-6">
            <AnimatePresence mode="sync">
              <motion.div
                key={currentPlaceholder}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                className="text-sm sm:text-base absolute"
              >
                {placeholders[currentPlaceholder]}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        <input
          onChange={(e) => {
            setValue(e.target.value);
            if (onChange) onChange(e);
          }}
          ref={inputRef}
          value={value}
          type="text"
          className={cn(
            "w-full h-full relative text-sm sm:text-base z-50 border-none text-white bg-transparent rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20"
          )}
        />
      </div>
    </form>
  );
}