"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

// Interface for the journal data
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

const ViewJournalPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [journal, setJournal] = useState<Journal | null>(null);
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
            fetchJournal(data.id); // Fetch the specific journal using the user ID
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [status, session]);

  // Fetch the specific journal based on the journal ID
  const fetchJournal = async (userId: string) => {
    try {
      const response = await fetch(`/api/getJournal?id=${id}&userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setJournal(data);
      } else {
        console.error("Failed to fetch the journal");
      }
    } catch (error) {
      console.error("Error fetching the journal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

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
          <div className="flex justify-between items-center mb-4">
            {/* Title Section */}
            <h1 className="text-2xl text-darkNavy font-bold">
              {journal?.title || "Journal Entry"}
            </h1>
            <span className="text-gray-600 text-sm">
              Created on:{" "}
              {new Date(journal?.createdAt || "").toLocaleDateString()}
            </span>
          </div>

          {/* Journal Content */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{
                __html: journal?.description || "No description available.",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJournalPage;
