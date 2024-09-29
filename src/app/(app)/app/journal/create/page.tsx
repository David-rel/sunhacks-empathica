"use client";
import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
  description?: string;
}

const CreateJournal = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data
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

  // Function to handle form submission
  const handleCreateJournal = async () => {
    try {
      const response = await fetch("/api/createJournal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData?.id,
          title,
          description,
        }),
      });
      if (response.ok) {
        // Navigate back to the journals page after creating
        router.push("/app/journal");
      } else {
        console.error("Failed to create journal");
      }
    } catch (error) {
      console.error("Error creating journal:", error);
    }
  };

  // Get today's date
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`flex-1 min-h-screen flex flex-col bg-gray-100 transition-all duration-300 pt-12`}
    >
      {/* Sidebar Component */}
      <Sidebar
        user={{
          name: userData?.name || "",
          profilePicture: userData?.profilePicture,
        }}
      />
      <div className="flex-1 flex flex-col pl-56">
        {/* TopBar Component */}
        <TopBar
          user={{
            name: userData?.name || "",
            profilePicture: userData?.profilePicture,
          }}
        />
        <div className="flex flex-col flex-grow p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-darkNavy font-bold">
              Create a Journal
            </h1>
            <span className="text-gray-600 text-sm">{today}</span>
          </div>
          {/* Journal Form Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Title Input */}
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2 text-darkNavy"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your journal title"
              />
            </div>
            {/* Description Input (React Quill) */}
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2 text-darkNavy"
                htmlFor="description"
              >
                Description
              </label>
              <ReactQuill
                value={description}
                onChange={setDescription}
                placeholder="Write your journal description..."
                className="h-40"
              />
            </div>
            {/* Create Journal Button */}
            <button
              onClick={handleCreateJournal}
              className="bg-brightTeal text-white rounded-lg px-4 py-2 mt-12"
              disabled={!title || !description.trim()}
            >
              Save Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function JournalEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateJournal />
    </Suspense>
  );
}
