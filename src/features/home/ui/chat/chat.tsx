"use client"
import React, { useState } from 'react';
import { Send, Plus, MessageSquareText } from 'lucide-react';
import Navbar from "@/features/home/ui/navbar/navbar";

// Define chat type
type Chat = {
    id: number;
    title: string;
    active: boolean;
};

// For backend integration, consider adding these types
// type Message = {
//     id: string;
//     content: string;
//     role: 'user' | 'assistant';
//     timestamp: Date;
// };
//
// type ChatWithMessages = Chat & {
//     messages: Message[];
// };

const ChatLayout = () => {
    // Local state management - for backend integration, consider fetching from API
    const [chats, setChats] = useState<Chat[]>([
        { id: 1, title: 'Previous chat 1', active: false },
        { id: 2, title: 'Previous chat 2', active: false }
    ]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [input, setInput] = useState('');
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [response, setResponse] = useState('');
    const [messageSent, setMessageSent] = useState(false);

    // BACKEND INTEGRATION: Replace this with API call to create a new chat
    // async function createNewChatOnBackend() {
    //     try {
    //         const response = await fetch('/api/chats', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ title: 'New Chat' })
    //         });
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Failed to create new chat:', error);
    //     }
    // }

    const handleNewChat = () => {
        // BACKEND INTEGRATION: Replace with actual API call
        // createNewChatOnBackend().then(newChatFromServer => {
        //     const updatedChats = chats.map(chat => ({ ...chat, active: false }));
        //     setChats([...updatedChats, { ...newChatFromServer, active: true }]);
        //     setActiveChat(newChatFromServer);
        //     setResponse('');
        //     setWaitingForResponse(false);
        //     setMessageSent(false);
        // });

        // Current local implementation
        const newChatId = chats.length > 0 ? Math.max(...chats.map(chat => chat.id)) + 1 : 1;
        const newChat: Chat = { id: newChatId, title: `New Chat ${newChatId}`, active: true };
        const updatedChats = chats.map(chat => ({ ...chat, active: false }));
        setChats([...updatedChats, newChat]);
        setActiveChat(newChat);
        setResponse('');
        setWaitingForResponse(false);
        setMessageSent(false); // Reset message sent status for new chat
    };

    // BACKEND INTEGRATION: Replace with API call to fetch chat history
    // async function fetchChatHistory(chatId: number) {
    //     try {
    //         const response = await fetch(`/api/chats/${chatId}`);
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Failed to fetch chat history:', error);
    //     }
    // }

    const handleSelectChat = (selectedChat: Chat) => {
        // BACKEND INTEGRATION: Fetch chat history from backend
        // fetchChatHistory(selectedChat.id).then(chatWithMessages => {
        //     // If the chat has existing messages, show last message and response
        //     if (chatWithMessages.messages && chatWithMessages.messages.length > 0) {
        //         const lastUserMessage = chatWithMessages.messages
        //             .filter(m => m.role === 'user')
        //             .pop();
        //         const lastAssistantMessage = chatWithMessages.messages
        //             .filter(m => m.role === 'assistant')
        //             .pop();
        //
        //         if (lastUserMessage) {
        //             setInput(lastUserMessage.content);
        //             setMessageSent(true);
        //         }
        //
        //         if (lastAssistantMessage) {
        //             setResponse(lastAssistantMessage.content);
        //         }
        //     } else {
        //         // New chat with no messages
        //         setInput('');
        //         setResponse('');
        //         setMessageSent(false);
        //     }
        // });

        // Current local implementation
        const updatedChats = chats.map(chat => ({
            ...chat,
            active: chat.id === selectedChat.id
        }));
        setChats(updatedChats);
        setActiveChat(selectedChat);
        setResponse('');
        setWaitingForResponse(false);
        setMessageSent(false); // Reset message sent status when selecting a different chat
    };

    // BACKEND INTEGRATION: Replace with API call to send message and get response
    // async function sendMessageToBackend(chatId: number, message: string) {
    //     try {
    //         const response = await fetch(`/api/chats/${chatId}/messages`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ content: message, role: 'user' })
    //         });
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Failed to send message:', error);
    //     }
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || waitingForResponse || !activeChat) return;

        setWaitingForResponse(true);

        // BACKEND INTEGRATION: Send message to backend API
        // try {
        //     // Send message to backend
        //     await sendMessageToBackend(activeChat.id, input);
        //
        //     // Get response from backend (or use websockets for streaming)
        //     const responseData = await fetch(`/api/chats/${activeChat.id}/messages/latest?role=assistant`);
        //     const responseJson = await responseData.json();
        //
        //     // Update UI with response
        //     setResponse(responseJson.content);
        //     setWaitingForResponse(false);
        //     setMessageSent(true);
        //
        //     // Update chat title if it's a new chat
        //     if (activeChat.title.startsWith('New Chat')) {
        //         const updatedChat = await fetch(`/api/chats/${activeChat.id}`, {
        //             method: 'PATCH',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({
        //                 title: input.slice(0, 20) + (input.length > 20 ? '...' : '')
        //             })
        //         }).then(res => res.json());
        //
        //         // Update local chat list with new title
        //         const updatedChats = chats.map(chat =>
        //             chat.id === activeChat.id ? { ...chat, title: updatedChat.title } : chat
        //         );
        //         setChats(updatedChats);
        //     }
        // } catch (error) {
        //     console.error('Error in message submission:', error);
        //     setWaitingForResponse(false);
        //     // Show error message to user
        // }

        // Current local implementation for demonstration
        setTimeout(() => {
            setResponse(`This is a response to: ${input}`);
            setWaitingForResponse(false);
            setMessageSent(true); // Set message sent to true after response

            if (activeChat?.title?.startsWith('New Chat')) {
                const updatedChats = chats.map(chat =>
                    chat.id === activeChat.id
                        ? { ...chat, title: input.slice(0, 20) + (input.length > 20 ? '...' : '') }
                        : chat
                );
                setChats(updatedChats);
            }
        }, 1000);
    };

    return (
        <div className="h-screen flex flex-col bg-[#030617] text-white">
            <Navbar />
            <div className="flex flex-1 overflow-hidden pt-16">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-800 flex flex-col bg-[#0a0d1f]">
                    <button
                        onClick={handleNewChat}
                        className="m-3 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center justify-center transition-colors duration-200"
                    >
                        <Plus size={18} className="mr-2" /> New Chat
                    </button>
                    <div className="flex-1 overflow-y-auto">
                        {/* BACKEND INTEGRATION: Fetch chat list from API on component mount
                            useEffect(() => {
                                fetch('/api/chats')
                                    .then(res => res.json())
                                    .then(data => setChats(data))
                                    .catch(err => console.error('Failed to fetch chats:', err));
                            }, []);
                        */}
                        {chats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat)}
                                className={`p-4 mx-2 my-1 rounded-lg text-left cursor-pointer truncate flex items-center ${
                                    chat.active
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                                } transition-all duration-200`}
                            >
                                <MessageSquareText size={16} className="mr-2 flex-shrink-0" />
                                <span className="truncate">{chat.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-6 overflow-y-auto bg-[#030617]">
                        {/* BACKEND INTEGRATION: Consider adding a key based on message IDs from backend
                            and potentially using a virtualized list for performance with large chats */}
                        {input && messageSent && (
                            <div className="bg-indigo-600/20 p-5 rounded-lg mb-4 shadow-lg">
                                {input}
                            </div>
                        )}
                        {waitingForResponse && (
                            <div className="flex items-center space-x-2 p-4 rounded-lg">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        {response && (
                            <div className="bg-gray-800/50 p-5 rounded-lg mb-4 shadow-lg">
                                {/* BACKEND INTEGRATION: Use a markdown renderer or HTML sanitizer if responses
                                    contain formatted text from the backend */}
                                {response}
                            </div>
                        )}
                    </div>
                    {/* Input area - only show if message not yet sent */}
                    {!messageSent && (
                        <div className="p-4 border-t border-gray-800 bg-[#0a0d1f]">
                            <form onSubmit={handleSubmit} className="flex">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full p-4 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                                        placeholder="Type your message here..."
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || waitingForResponse || !activeChat}
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-2 
                                        ${input.trim() && !waitingForResponse && activeChat
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'} 
                                        transition-colors duration-200`}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;