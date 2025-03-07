// components/Sidebar.tsx
"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type ChatItem = {
  id: string;
  endpoint: string;
  name: string;
  query: string;
  lastUpdated: string;
  url: string;
};

interface SidebarComponentProps {
  chats: ChatItem[];
  isLoadingChats: boolean;
  selectedChatId: string | null;
  handleSelectChat: (id: string) => void;
  handleNewChat: () => void;
  userId: string;
}

export function SidebarComponent({
  chats,
  isLoadingChats,
  selectedChatId,
  handleSelectChat,
  handleNewChat,
  userId,
}: SidebarComponentProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <>
      <SidebarHeader>
        <Link href="/">
          <span className="block px-2 py-4 text-center text-2xl font-bold text-white">
            FetchHive
          </span>
        </Link>
        <SidebarMenuButton
          size="lg"
          onClick={handleNewChat}
          className="w-full justify-start gap-2 bg-[#16161d] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <div className="px-2 py-1 text-xs font-medium text-gray-400">
          Recent APIs
        </div>
        <SidebarMenu>
          {isLoadingChats ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">
              No APIs created yet
            </div>
          ) : (
            chats.map((chat) => (
              <SidebarMenuItem key={chat.id} className="px-2">
                <a target="_blank" href={`/api/results/${userId}/${chat.name}`}>
                  <SidebarMenuButton
                    isActive={selectedChatId === chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`h-16 w-full justify-start px-4 py-3 transition-all duration-300 ${
                      selectedChatId === chat.id
                        ? "bg-gray-700"
                        : "hover:scale-[1.02] hover:bg-white"
                    }`}
                  >
                    <MessageSquare
                      size={16}
                      className="-ml-1 mr-2 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="flex h-full flex-1 flex-col justify-around overflow-hidden overflow-y-visible">
                      <span className="truncate">{chat.name}</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(chat.lastUpdated)}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
