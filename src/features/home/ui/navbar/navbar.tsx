"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Menu, X, Zap } from 'lucide-react';
import { Marquee } from "@/components/magicui/marquee";
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const [userData, setUserData] = useState<{
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null;
    };
    session: {
        id: string;
        createdAt: Date;
        userAgent?: string | null;
    };
} | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      authClient.getSession()
          .then(({ data }) => setUserData(data))
          .catch(error => console.error("Failed to fetch user session:", error));
  }, []);
  
  

    const navItems = [
        { label: 'Chat', href: 'chat' },

    ];

    const handleLinkClick = () => setIsMenuOpen(false);
    
    const handleLogout = async () => {
        await authClient.signOut();
        setUserData(null);
    };

    return (
        <div className="flex w-full flex-col">
            <nav className="fixed left-0 right-0 top-0 z-40 bg-[#030617]/80 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out">
                <div className="container mx-auto flex items-center justify-between px-4 py-5">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center space-x-2">
                        <Zap size={24} className="text-indigo-400" />
                       <Link href={"/"} ><span className="text-2xl font-bold text-white">FetchHive</span></Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="hidden items-center space-x-8 md:flex">
                    {userData && navItems.map((item, index) => (
                                <a key={index} href={item.href} onClick={handleLinkClick} className="py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white">
                                    {item.label}
                                </a>
                            ))}

                        <div className="flex items-center space-x-4">
                            {userData ? (

                                  <ShimmerButton className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 shadow-lg">
                                    <span className="text-sm font-medium text-white">Log-Out</span>
                                  </ShimmerButton>
                            ) : (
                                <>
                                    <a href="/sign-in" className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white">Log In</a>
                                    <Link href="/sign-up">
                                        <ShimmerButton className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 shadow-lg">
                                            <span className="text-sm font-medium text-white">Sign Up</span>
                                        </ShimmerButton>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-md p-1 text-white transition-colors duration-200 hover:bg-gray-800/50 focus:outline-none">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="absolute left-0 right-0 top-full border-t border-gray-800 bg-[#030617] p-4 shadow-lg md:hidden">
                        <div className="flex flex-col space-y-4 py-2">
                        {userData && navItems.map((item, index) => (
                                <a key={index} href={item.href} onClick={handleLinkClick} className="py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white">
                                    {item.label}
                                </a>
                            ))}
                            <div className="mt-2 space-y-4 border-t border-gray-800 pt-4">
                                {userData ? (
                                    <button onClick={handleLogout} className="block w-full py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white">
                                        Logout
                                    </button>
                                ) : (
                                    <>
                                        <a href="/sign-in" onClick={handleLinkClick} className="block py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white">Log In</a>
                                        <a href="/sign-up" onClick={handleLinkClick} className="block py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white">
                                        <ShimmerButton className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-3 shadow-lg">
                                            <span className="text-sm font-medium text-white">Sign Up</span>
                                        </ShimmerButton>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>

            <div className="fixed left-0 right-0 top-[75px] z-40 w-full bg-[#030617]">
                <Marquee pauseOnHover={true} className="w-full py-1 font-medium text-white">
                    <div className="flex items-center px-4 space-x-4">
                        {Array(12).fill("FetchHive").map((text, index) => (
                            <span key={index} className="mx-4">{text}</span>
                        ))}
                    </div>
                </Marquee>
            </div>

            <div className="h-[74px]"></div>
        </div>
    );
}
