"use client"
import {LampContainer} from "@/components/ui/lamp";
import { motion } from "framer-motion";
import {Cover} from "@/components/ui/cover";

export default function Lamp() {
    return (
        <LampContainer className="flex flex-col items-center">
            <div className={"flex flex-col justify-around"}>
                <div className={"flex flex-col -mt-44 justify-around"}>
                    <motion.h1
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        className="text-5xl pt-8 font-bold text-white text-center"
                    >
                        Build APIs from Just a Prompt
                    </motion.h1>

                    <motion.p
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1}}
                        className="text-lg text-neutral-300 text-center mt-4"
                    >
                        Describe your needs — Generate APIs — Deploy Instantly
                    </motion.p>
                </div>
                <motion.div
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 1.2}}
                    className="text-center mt-6"
                >
                    <Cover>
                    <span className="text-white font-semibold text-lg">
                        Experience the Future of API Development 🚀
                    </span>
                    </Cover>
                </motion.div>
                <div className={"flex flex-col -mb-44 justify-between h-3/4"}>
                    <motion.p
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1.4}}
                        className="text-neutral-400 text-center mt-10 text-base"
                    >
                        No Code Needed | Real-Time APIs | AI Powered <br/>
                        Join the revolution and build your API in seconds!
                    </motion.p>
                </div>
            </div>
        </LampContainer>
    )
}
