"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Menu, X, Zap } from 'lucide-react';
import { Marquee } from "@/components/magicui/marquee";

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
      <div className="flex w-full flex-col">
        <nav
          className={`fixed left-0 right-0 top-0 z-50 ${isScrolled ? "bg-[#030617]/80 shadow-lg backdrop-blur-md" : "bg-[#030617]"} transition-all duration-300 ease-in-out`}
        >
          <div className="container mx-auto flex items-center justify-between px-4 py-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Zap size={24} className="text-indigo-400" />
              <span className="text-2xl font-bold text-white">FetchHive</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden items-center space-x-8 md:flex"
            >
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
                >
                  Log In
                </a>
                <ShimmerButton className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 shadow-lg">
                  <span className="text-sm font-medium text-white">
                    Sign Up
                  </span>
                </ShimmerButton>
              </div>
            </motion.div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md p-1 text-white transition-colors duration-200 hover:bg-gray-800/50 focus:outline-none"
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
              className="absolute left-0 right-0 top-full border-t border-gray-800 bg-[#030617] p-4 shadow-lg md:hidden"
            >
              <div className="flex flex-col space-y-4 py-2">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-2 space-y-4 border-t border-gray-800 pt-4">
                  <a
                    href="/login"
                    onClick={handleLinkClick}
                    className="block py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    Log In
                  </a>
                  <ShimmerButton className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-3 shadow-lg">
                    <span className="text-sm font-medium text-white">
                      Sign Up
                    </span>
                  </ShimmerButton>
                </div>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Added the marquee outside the nav but still fixed at the top */}
        <div className="fixed left-0 right-0 top-[70px] z-40 w-full bg-[#030617]">
          <Marquee
            pauseOnHover={true}
            className="w-full py-1 font-medium text-white"
          >
              <div className="flex items-center px-4">
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
                  <span className={"mx-4"}>FetchHive</span>
              </div>
          </Marquee>
        </div>

          {/* Add padding to push content below the navbar and marquee */}
          <div className="h-[74px]"></div>
      </div>
    );
}