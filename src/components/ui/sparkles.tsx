"use client";
import React, { useId, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    })
      .then(() => {
        setInit(true);
      })
      .catch((error) => {
        console.error("Particles init failed", error);
      });
  }, []);

  const controls = useAnimation();

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      await controls.start({
        opacity: 1,
        transition: { duration: 1 },
      });
    }
  };

  const generatedId = useId();

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id ?? generatedId}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background ?? "#0d47a1" } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                resize: {
                  enable: true,
                },
              },
            },
            particles: {
              color: { value: particleColor ?? "#ffffff" },
              move: { enable: true, speed: { min: 0.1, max: speed ?? 4 } },
              number: { value: particleDensity ?? 120 },
              size: { value: { min: minSize ?? 1, max: maxSize ?? 3 } },
            },
          }}
        />
      )}
    </motion.div>
  );
};
