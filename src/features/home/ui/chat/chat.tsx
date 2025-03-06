"use client"

import { useState, useEffect } from "react"
import { api } from "@/trpc/react"
import { AuroraBackground } from "@/components/ui/aurora-background"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageSquare, Plus, Settings, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"

export default function ChatPage() {
  // Use client-side only rendering to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)
  const [chatStart, setChatStart] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedChatId, setSelectedChatId] = useState(1)
  const [isLoadingChats, setIsLoadingChats] = useState(false)

  const placeholders = [
    "Ask any data you want ",
    "What API can I help you with?",
    "Ask any data you want ",
    "What API can I help you with?",  
  ];

  const chats = [
    { id: 1, title: "API Generation Discussion", createdAt: "2025-03-05T10:30:00" },
    { id: 2, title: "Project Roadmap", createdAt: "2025-03-04T15:20:00" },
    { id: 3, title: "User Feedback", createdAt: "2025-03-03T12:10:00" },
  ]

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  const generateSchemaMutation = api.generateSchema.useMutation({
    onSuccess: (data) => {
      console.log("Generated schema:", data.schema)
    },
    onError: (error) => {
      console.error("Error generating schema:", error)
    },
  })

  const handleSelectChat = (id: number) => {
    setSelectedChatId(id)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const handleGenerateSchema = () => {
    setChatStart(true)
    generateSchemaMutation.mutate({ query })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  // Only render the component content after client-side hydration
  if (!isClient) {
    return <div className="flex h-screen bg-black"></div> // Simple loading state
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-[#16161d]">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenuButton 
              size="lg" 
              className="w-full justify-start gap-2 bg-[#16161d] text-white transition-all duration-300 hover:bg-white hover:scale-[1.02]"
            >
              <Plus size={16} />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarHeader>

          <SidebarContent>
            <div className="px-2 py-1 text-xs font-medium text-gray-400">Recent Chats</div>
            <SidebarMenu>
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 "></div>
                </div>
              ) : (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      isActive={selectedChatId === chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full justify-start px-4 py-8 transition-all duration-300 ${
                        selectedChatId === chat.id 
                          ? "bg-gray-700" 
                          : "hover:bg-white hover:scale-[1.02]"
                      }`}
                    >
                      <MessageSquare size={16} className="transition-transform duration-300 group-hover:scale-110" />
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate">{chat.title}</span>
                        <span className="text-xs text-gray-400">{formatDate(chat.createdAt)}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="fixed left-4 top-4 z-50 md:hidden">
            <SidebarTrigger />
          </div>

          <AuroraBackground className="z-0 min-h-screen bg-black text-white">
            {!chatStart ? (
              <div className="z-10 mx-auto flex max-w-4xl flex-col p-4 pt-16 md:p-8 md:pt-8">
                <h1 className="mb-12 text-3xl font-light opacity-50">What can Fetch Hive help you with today?</h1>
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleChange}
                  onSubmit={onSubmit}
                />
                <div className="mb-4 flex items-center justify-center text-white">
                  <div className="flex h-16 w-full rounded-b-xl bg-[#282828] px-4 pt-4 font-bold text-[#6687ae]">
                    Choose Model
                    <Select>
                      <SelectTrigger className="mx-4 w-fit">
                        <SelectValue placeholder="Gemini"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="gemini">Gemini</SelectItem>
                          <SelectItem value="openAIo3">openAI-o3</SelectItem>
                          <SelectItem value="deepseek">Deepseek r3</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <button
                  onClick={handleGenerateSchema}
                  className="mb-4 cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                >
                  {generateSchemaMutation.isPending ? "Generating..." : "Generate Schema"}
                </button>

                {generateSchemaMutation.error && (
                  <div className="mb-4 text-red-500">{generateSchemaMutation.error.message}</div>
                )}
              </div>
            ) : (
              <div>Hello</div>
            )}
          </AuroraBackground>
        </main>
      </div>
    </SidebarProvider>
  )
}