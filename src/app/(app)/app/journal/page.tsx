"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Journal {
  id: string;
  title: string;
  description?: string;
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

const JournalPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
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
            fetchJournals(data.id); // Fetch journals using the user ID
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

  // Fetch journals based on user ID
  const fetchJournals = async (userId: string) => {
    try {
      const response = await fetch(`/api/getJournals?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setJournals(data);
      } else {
        console.error("Failed to fetch journals");
      }
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a journal
  const handleDeleteJournal = async (journalId: string) => {
    try {
      const response = await fetch(`/api/deleteJournal?id=${journalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted journal from the state
        setJournals((prevJournals) =>
          prevJournals.filter((journal) => journal.id !== journalId)
        );
        alert("Journal deleted successfully!");
      } else {
        console.error("Failed to delete journal");
        alert("Failed to delete the journal. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("An error occurred while deleting the journal.");
    }
  };

  // Function to strip HTML tags and limit description length
  const formatDescription = (htmlContent: string) => {
    const strippedContent = htmlContent.replace(/<[^>]+>/g, ""); // Remove HTML tags
    return strippedContent.length > 100
      ? strippedContent.substring(0, 100) + "..."
      : strippedContent;
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
            <h1 className="text-2xl text-darkNavy font-bold">Your Journals</h1>
            <span className="text-gray-600 text-sm">
              Create and manage your journals here.
            </span>
            {/* Create Journal Button */}
            <Link href="/app/journal/create">
              <button className="bg-brightTeal text-white rounded-lg px-4 py-2">
                Create Journal
              </button>
            </Link>
          </div>
          {/* Display Journals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {journals.length > 0 ? (
              journals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h2 className="text-lg font-bold mb-2">{journal.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {formatDescription(
                      journal.description || "No description provided."
                    )}
                  </p>
                  <div className="flex justify-between">
                    <Link href={`/app/journal/${journal.id}`}>
                      <button className="text-green-500 hover:underline">
                        View
                      </button>
                    </Link>
                    <Link href={`/app/journal/edit?id=${journal.id}`}>
                      <button className="text-blue-500 hover:underline">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteJournal(journal.id)} // Attach delete handler
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-full">
                No journals found. Start by creating one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
