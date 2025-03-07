"use client";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import { Cover } from "@/components/ui/cover";

export default function Lamp() {
  return (
    <LampContainer className="flex flex-col items-center">
      <div className={"flex flex-col justify-around"}>
        <div className={"-mt-44 flex flex-col justify-around"}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-8 text-center text-5xl font-bold text-white"
          >
            Build APIs from Just a Prompt
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-4 text-center text-lg text-neutral-300"
          >
            Describe your needs — Generate APIs — Deploy Instantly
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="mt-6 text-center"
        >
          <Cover>
            <span className="text-lg font-semibold text-white">
              Experience the Future of API Development 🚀
            </span>
          </Cover>
        </motion.div>
        <div className={"-mb-44 flex h-3/4 flex-col justify-between"}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            className="mt-10 text-center text-base text-neutral-400"
          >
            No Code Needed | Real-Time APIs | AI Powered <br />
            Join the revolution and build your API in seconds!
          </motion.p>
        </div>
      </div>
    </LampContainer>
  );
}
