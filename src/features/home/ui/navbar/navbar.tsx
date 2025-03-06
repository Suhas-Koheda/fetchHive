"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Menu, X, Zap } from 'lucide-react';
import Link from "next/link"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);



    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Docs', href: '#docs' },
    ];

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-50 h-[50px] 
                bg-transparent
                transition-all duration-300 ease-in-out
            `}
        >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-2"
                >
                    <Zap size={24} className="text-indigo-400" />
                    <span className="text-2xl font-bold text-white">
                        FetchHive
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="hidden md:flex items-center space-x-8"
                >
                    {navItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                        >
                            {item.label}
                        </a>
                    ))}
                    <div className="flex items-center space-x-4">
                        <a
                            href="/sign-in"
                            className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                        >
                            Log In
                        </a>
                        <Link href='/sign-up'>
                            <ShimmerButton className="shadow-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 rounded-lg">
                              <span className="text-sm font-medium text-white">Sign Up</span>
                            </ShimmerButton>
                        </Link>
                    </div>
                </motion.div>

                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white focus:outline-none p-1 rounded-md hover:bg-gray-800/50 transition-colors duration-200"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden absolute top-full left-0 right-0 p-4 bg-[#030617] shadow-lg border-t border-gray-800"
                >
                    <div className="flex flex-col space-y-4 py-2">
                        {navItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                onClick={handleLinkClick}
                                className="text-gray-300 hover:text-white py-2 transition-colors duration-200 text-sm font-medium"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="border-t border-gray-800 pt-4 mt-2 space-y-4">
                            <a
                                href="/login"
                                onClick={handleLinkClick}
                                className="block text-gray-300 hover:text-white py-2 transition-colors duration-200 text-sm font-medium"
                            >
                                Log In
                            </a>
                            <ShimmerButton className="w-full shadow-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-3 rounded-lg">
                                <span className="text-sm font-medium text-white">Sign Up</span>
                            </ShimmerButton>
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}