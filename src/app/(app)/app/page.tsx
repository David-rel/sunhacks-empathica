"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import { FaPaperPlane, FaChevronDown } from "react-icons/fa"; // Import icons

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

const Chat = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { message: string; sender: "user" | "bot" }[]
  >([]);
  const [pastChatsOpen, setPastChatsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botId, setBotId] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  useEffect(() => {
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
    fetchUserData();
  }, [status, session]);

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatHistory((prev) => [...prev, { message, sender: "user" }]);
      try {
        setMessage(""); // Clear the input
        setWaitingForResponse(true);

        if (!threadId || !botId) {
          // First message, initialize chat and get threadId and botId
          const response = await fetch("/api/getBot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
          });
          if (response.ok) {
            const { threadId: newThreadId, botId: newBotId } =
              await response.json();
            setThreadId(newThreadId);
            setBotId(newBotId);
            console.log(message);
            // Call fetchRunId to start getting the runId and send the message
            await fetchRunId(newThreadId, newBotId, message);
          } else {
            console.error("Failed to initialize chat");
          }
        } else {
          // If threadId and botId exist, directly send the message
          await fetchRunId(threadId, botId, message);
        }
      } catch (error) {
        console.error("Error handling the message:", error);
      }
      setMessage(""); // Clear the input
      console.log("Message sent to AI:", message);
    }
  };

  // Function to get the Run ID after sending a message
  const fetchRunId = async (
    currentThreadId: string,
    currentBotId: string,
    userMessage: string
  ) => {
    try {
      console.log("fetch run id: " + userMessage);
      // Send the message to the runId endpoint
      const response = await fetch("/api/getRunId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: currentThreadId,
          botId: currentBotId,
          message: userMessage, // Include the user's message
        }),
      });

      if (response.ok) {
        const { runId: newRunId } = await response.json();
        setRunId(newRunId);
        // Start checking for the bot's response using the new runId
        checkForResponse(currentThreadId, newRunId);
      } else {
        console.error("Failed to get Run ID");
      }
    } catch (error) {
      console.error("Error fetching Run ID:", error);
    }
  };

  // Continuously check for the response from OpenAI
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
            setChatHistory((prev) => [...prev, { message, sender: "bot" }]);
            setWaitingForResponse(false);
          } else {
            // If not completed, check again after a delay
            setTimeout(fetchMessages, 2000); // Polling interval, adjust as needed
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
          {" "}
          {/* Changed to relative for the fixed input */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <button
                onClick={() => setPastChatsOpen((prev) => !prev)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center"
              >
                <span className="mr-2">Past Chats</span>
                <FaChevronDown />
              </button>
              {pastChatsOpen && (
                <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Chat 1
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Chat 2
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Chat 3
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <h1 className="text-2xl text-darkNavy mx-auto align-middle font-bold mb-4 text-center">
              Chat with Our AI
            </h1>
            <button className="bg-brightTeal text-white rounded-lg px-4 py-2">
              Talk with AI
            </button>
          </div>
          {/* Chat content container */}
          <div className="flex-grow bg-white rounded-lg shadow-md p-4 flex flex-col overflow-y-auto mb-16">
            {" "}
            {/* Added mb-16 to prevent overlap with the input */}
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
            {" "}
            {/* Added border-t for a subtle line */}
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

export default Chat;
