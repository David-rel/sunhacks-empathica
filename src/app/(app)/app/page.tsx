"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import { FaPaperPlane, FaChevronDown } from "react-icons/fa";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Thread {
  id: string;
  threadsId: string;
  createdAt: string;
}

const Chat = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { message: string; sender: "user" | "bot"; createdAt?: Date }[]
  >([]);
  const [pastChatsOpen, setPastChatsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botId, setBotId] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);

  // Fetch user data and available threads when component mounts
  useEffect(() => {
    const urlThreadId = searchParams.get("threadId");
    if (urlThreadId) {
      setThreadId(urlThreadId);
      fetchThreadMessages(urlThreadId);
    }

    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/getUser?id=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchThreads = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/getThreads?id=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setThreads(data);
          } else {
            console.error("Failed to fetch threads");
          }
        } catch (error) {
          console.error("Error fetching threads:", error);
        }
      }
    };

    fetchUserData();
    fetchThreads();
  }, [status, session]);

  // Fetch messages from OpenAI for the selected thread
  const fetchThreadMessages = async (selectedThreadId: string) => {
    try {
      const response = await fetch(
        `/api/getThreadMessages?threadId=${selectedThreadId}`
      );
      if (response.ok) {
        const data = await response.json();
        const messages = data.messages;

        const formattedMessages = messages
          .map((msg: any) => ({
            message: msg.message,
            sender: msg.sender,
            createdAt: new Date(msg.createdAt),
          }))
          .sort(
            (
              a: { createdAt: { getTime: () => number } },
              b: { createdAt: { getTime: () => number } }
            ) => a.createdAt.getTime() - b.createdAt.getTime()
          );

        setChatHistory(formattedMessages);
        setThreadId(selectedThreadId);
        setBotId(null);
      } else {
        console.error("Failed to fetch thread messages");
      }
    } catch (error) {
      console.error("Error fetching thread messages:", error);
    }
  };

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatHistory((prev) => [...prev, { message, sender: "user" }]);
      try {
        setMessage("");
        setWaitingForResponse(true);

        // Check if threadId exists
        if (threadId && botId) {
          await fetchRunId(threadId, botId, message, false); // Pass false for isFirstMessage
        } else {
          // Initialize a new chat and get threadId and botId
          const response = await fetch("/api/getBot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, userId: session?.user.id }), // Include userId
          });
          if (response.ok) {
            const { threadId: newThreadId, botId: newBotId } =
              await response.json();
            setThreadId(newThreadId);
            setBotId(newBotId);
            await fetchRunId(newThreadId, newBotId, message, true); // Pass true for isFirstMessage
          } else {
            console.error("Failed to initialize chat");
          }
        }
      } catch (error) {
        console.error("Error handling the message:", error);
      }
      setMessage("");
    }
  };

  // Update fetchRunId to handle isFirstMessage
  const fetchRunId = async (
    currentThreadId: string,
    currentBotId: string,
    userMessage: string,
    isFirstMessage: boolean
  ) => {
    try {
      const response = await fetch("/api/getRunId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: currentThreadId,
          botId: currentBotId,
          message: userMessage,
          userId: session?.user.id,
          isFirstMessage, // Include isFirstMessage flag
        }),
      });
      if (response.ok) {
        const { runId: newRunId } = await response.json();
        setRunId(newRunId);
        checkForResponse(currentThreadId, newRunId);
      } else {
        console.error("Failed to get Run ID");
      }
    } catch (error) {
      console.error("Error fetching Run ID:", error);
    }
  };

  const checkForResponse = async (
    currentThreadId: string,
    currentRunId: string
  ) => {
    setWaitingForResponse(true);
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/getResponse?thread_id=${currentThreadId}&run_id=${currentRunId}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const { status, message } = await response.json();
          if (status === "completed") {
            setChatHistory((prev) => [
              ...prev,
              { message, sender: "bot", createdAt: new Date() },
            ]);
            setWaitingForResponse(false);
          } else {
            setTimeout(fetchMessages, 2000);
          }
        } else {
          console.error("Failed to retrieve messages");
          setWaitingForResponse(false);
        }
      } catch (error) {
        console.error("Error retrieving messages:", error);
        setWaitingForResponse(false);
      }
    };
    fetchMessages();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !waitingForResponse) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleThreadClick = (selectedThreadId: string) => {
    setThreadId(selectedThreadId);
    router.push(`/app?threadId=${selectedThreadId}`);
    fetchThreadMessages(selectedThreadId);
  };

  return (
    <div
      className={`flex-1 min-h-screen flex flex-col bg-gray-100 transition-all duration-300 pt-12`}
    >
      <Sidebar
        user={{
          name: userData?.name || "",
          profilePicture: userData?.profilePicture,
        }}
      />
      <div className="flex-1 flex flex-col pl-56">
        <TopBar
          user={{
            name: userData?.name || "",
            profilePicture: userData?.profilePicture,
          }}
        />
        <div className="flex flex-col flex-grow p-6 relative">
          <div className="relative flex justify-between items-center mb-4">
            {/* Left section: Past Chats Button */}
            <div className="relative">
              <button
                onClick={() => setPastChatsOpen((prev) => !prev)}
                className="bg-white border px-4 py-2 flex items-center"
              >
                <span className="mr-2">Past Chats</span>
                <FaChevronDown />
              </button>
              {pastChatsOpen && (
                <div className="absolute left-0 mt-2 bg-white border rounded-md shadow-lg z-10">
                  <ul>
                    {threads.length > 0 ? (
                      threads.map((thread) => (
                        <li
                          key={thread.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleThreadClick(thread.threadsId)}
                        >
                          {thread.threadsId}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No past chats</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Center section: Title */}
            <h1 className="text-2xl text-darkNavy font-bold text-center">
              Chat with Our AI
            </h1>

           
          </div>

          {/* Chat content container */}
          <div className="flex-grow bg-white rounded-lg shadow-md p-4 flex flex-col overflow-y-auto mb-16">
            <div className="flex-grow overflow-y-auto p-2">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${
                    chat.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className={`rounded-lg p-2 max-w-[66%] break-words ${
                      chat.sender === "user"
                        ? "bg-softBlue text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {chat.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Fixed input bar */}
          <div className="absolute bottom-0 left-0 w-full bg-white p-4 flex items-center border-t border-gray-300">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-gray-400 p-2 rounded-lg flex-grow mr-2"
              placeholder="Type your message..."
              disabled={waitingForResponse}
            />
            <button
              onClick={handleSendMessage}
              className="bg-brightTeal text-white rounded-lg p-2 flex items-center justify-center"
              disabled={waitingForResponse}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chat />
    </Suspense>
  );
}
