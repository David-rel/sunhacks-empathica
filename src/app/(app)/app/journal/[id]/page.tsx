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

  // Fetch user and journal data
  useEffect(() => {
    const fetchUserDataAndJournal = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          // Fetch user data
          const userResponse = await fetch(
            `/api/getUser?id=${session.user.id}`
          );
          if (!userResponse.ok) throw new Error("Failed to fetch user data");

          const userData = await userResponse.json();
          setUserData(userData);

          // Fetch the specific journal
          const journalResponse = await fetch(
            `/api/getJournal?id=${id}&userId=${userData.id}`
          );
          if (!journalResponse.ok)
            throw new Error("Failed to fetch the journal");

          const journalData = await journalResponse.json();
          setJournal(journalData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        router.push("/app/login");
      }
    };

    if (status !== "loading") {
      fetchUserDataAndJournal();
    }
  }, [status, session, id, router]);

  if (status === "loading" || loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-gray-100 transition-all duration-300 pt-12">
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
              {journal?.createdAt
                ? new Date(journal.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          {/* Journal Content */}
          <div className="bg-white shadow-md rounded-lg p-6 overflow-hidden">
            <div
              className="text-gray-700 break-words"
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
