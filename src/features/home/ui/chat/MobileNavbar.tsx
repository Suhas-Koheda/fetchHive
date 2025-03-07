// components/MobileNavbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Plus, MessageSquare, Home } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ChatItem = {
  id: string;
  endpoint: string;
  name: string;
  query: string;
  lastUpdated: string;
  url: string;
};

interface MobileNavbarProps {
  handleNewChat: () => void;
  chats: ChatItem[];
  selectedChatId: string | null;
  handleSelectChat: (id: string) => void;
  userId: string;
  isLoadingChats: boolean;
}

export function MobileNavbar({
  handleNewChat,
  chats,
  selectedChatId,
  handleSelectChat,
  userId,
  isLoadingChats,
}: MobileNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-[#16161d] p-4 text-white">
        <Link href="/">
          <span className="text-xl font-bold text-white">FetchHive</span>
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleNewChat}
            className="rounded-full bg-[#16161d] p-2 transition-all duration-300 hover:bg-gray-700"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={toggleMenu}
            className="rounded-full bg-[#16161d] p-2 transition-all duration-300 hover:bg-gray-700"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-70 pt-16">
          <div className="h-full overflow-y-auto bg-[#16161d] p-4">
            <div className="px-2 py-3 text-sm font-medium text-gray-400">
              Recent APIs
            </div>
            {isLoadingChats ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            ) : chats.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400">
                No APIs created yet
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div key={chat.id} className="px-2">
                    <a
                      target="_blank"
                      href={`/api/results/${userId}/${chat.name}`}
                      onClick={() => {
                        handleSelectChat(chat.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <div
                        className={`flex items-center rounded-lg p-3 transition-all duration-300 ${
                          selectedChatId === chat.id
                            ? "bg-gray-700"
                            : "hover:bg-gray-800"
                        }`}
                      >
                        <MessageSquare size={16} className="mr-3" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate text-white">
                            {chat.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(chat.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t border-gray-800 pt-4">
              <Link href="/">
                <div className="flex items-center rounded-lg p-3 transition-all duration-300 hover:bg-gray-800">
                  <Home size={16} className="mr-3" />
                  <span>Home</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
