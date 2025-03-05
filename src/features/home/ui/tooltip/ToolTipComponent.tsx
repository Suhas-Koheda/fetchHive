"use client";
import React from "react";
import {AnimatedTooltip} from "@/features/home/ui/tooltip/ToolTip";

const people = [
    {
        id: 1,
        name: "Next.js",
        designation: "Framework",
        image: "https://img.icons8.com/?size=100&id=r2OarXWQc7B6&format=png&color=FFFFFF",
    },
    {
        id: 2,
        name: "Firecrawl",
        designation: "Web Crawler",
        image: "https://firecrawl.com/logo.svg",
    },
    {
        id: 3,
        name: "Redis",
        designation: "In-memory Database",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Redis_logo.svg/200px-Redis_logo.svg.png",
    },
    {
        id: 4,
        name: "Better Auth",
        designation: "Authentication",
        image: "https://cdn.worldvectorlogo.com/logos/auth0.svg",
    },
    {
        id: 5,
        name: "Drizzle ORM",
        designation: "ORM",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcCNoMzNpN52Oh7MvcQWjh1mv1SpETrQ3PPw&s",
    },
    {
        id: 6,
        name: "Neon Postgres",
        designation: "Database",
        image: "https://community.neon.tech/uploads/default/original/1X/7d9c2fe1924470ab649c75f01a04dae08f910420.png",
    },
    {
        id: 7,
        name: "tRPC",
        designation: "API",
        image: "https://avatars.githubusercontent.com/u/78011399?s=200&v=4",
    }
];

export function ToolTipComponent() {
    return (
        <div className="flex flex-col items-center justify-center w-full py-16 z-10 bg-[#030617]">
            <h2 className="text-white text-3xl font-bold mb-6 text-center heading">The Tech Stack We Use</h2>
            <div className={"flex flex-col sm:flex-row items-center justify-center py-8"}>
                <AnimatedTooltip items={people} />
            </div>
        </div>
    );
}