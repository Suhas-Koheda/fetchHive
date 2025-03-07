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
        "relative mx-auto flex h-12 w-full max-w-3xl overflow-hidden rounded-t-xl bg-[#282828] text-white shadow transition duration-200 dark:bg-zinc-800",
        value && "bg-[#282828]",
      )}
      onSubmit={handleSubmit}
    >
      <div className="relative h-full">
        {value === "" && (
          <div className="pointer-events-none absolute left-4 top-1/2 h-6 w-4/5 -translate-y-1/2 overflow-hidden sm:left-10">
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
                className="absolute text-sm sm:text-base"
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
            "relative z-50 h-full w-full rounded-full border-none bg-transparent pl-4 pr-20 text-sm text-white focus:outline-none focus:ring-0 sm:pl-10 sm:text-base",
          )}
        />
      </div>
    </form>
  );
}
