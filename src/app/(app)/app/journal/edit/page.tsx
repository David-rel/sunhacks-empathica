"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic for lazy loading
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import "react-quill/dist/quill.snow.css"; // Make sure you import the styles
import { Suspense } from "react";


// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Interface for journal
interface Journal {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
  description?: string;
}

const EditJournalComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const journalId = searchParams.get("id");
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [journal, setJournal] = useState<Journal | null>(null);
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
            if (journalId) {
              await fetchJournalData(journalId, data.id); // Pass the userId as well
            } else {
              setLoading(false);
            }
          } else {
            console.error("Failed to fetch user data");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [status, session, journalId]);

  // Fetch specific journal data
  const fetchJournalData = async (id: string, userId: string) => {
    try {
      const response = await fetch(`/api/getJournal?id=${id}&userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setJournal(data);
        setTitle(data.title);
        setDescription(data.description);
      } else {
        console.error("Failed to fetch journal data");
      }
    } catch (error) {
      console.error("Error fetching journal data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  // Handle form submission
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/updateJournal`, {
        method: "PUT", // Change this from POST to PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: journalId, title, description }),
      });
      if (response.ok) {
        router.push("/app/journal");
      } else {
        console.error("Failed to update journal");
      }
    } catch (error) {
      console.error("Error updating journal:", error);
    }
  };

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-gray-100 transition-all duration-300 pt-12">
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
        <div className="flex flex-col flex-grow p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl text-darkNavy font-bold">Edit Journal</h1>
            <span className="text-gray-600 text-sm">
              Modify your journal details below
            </span>
            <div className="text-sm text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </div>
          </div>
          {/* Edit Journal Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Title"
            />
            <ReactQuill
              value={description}
              onChange={setDescription}
              className="h-64 mb-4"
            />
            <button
              onClick={handleSave}
              className="bg-brightTeal text-white rounded px-4 py-2 mt-12"
            >
              Save Changes
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
      <EditJournalComponent />
    </Suspense>
  );
}
