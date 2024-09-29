"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { FaClock, FaHourglassHalf, FaHourglassEnd } from "react-icons/fa";
import Link from "next/link";

interface Meditation {
  id: string;
  type: string;
  startedAt: string;
  completedAt?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
}

const Meditations = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/getUser?id=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            fetchMeditations(data.id); // Fetch meditations using the user ID
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

  const fetchMeditations = async (userId: string) => {
    try {
      const response = await fetch(`/api/getMeditations?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMeditations(data);
      } else {
        console.error("Failed to fetch meditations");
      }
    } catch (error) {
      console.error("Error fetching meditations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return <div>Loading...</div>;

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
          <h1 className="text-2xl text-darkNavy font-bold mb-6">Meditations</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <FaClock className="text-brightTeal text-4xl mx-auto mb-2" />
              <h2 className="font-bold text-lg mb-2">30-Second Meditation</h2>
              <Link href="/app/meditations/thirtySeconds">
                <button className="bg-brightTeal text-white rounded-lg px-4 py-2">
                  Start
                </button>
              </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <FaHourglassHalf className="text-brightTeal text-4xl mx-auto mb-2" />
              <h2 className="font-bold text-lg mb-2">1-Minute Meditation</h2>
              <Link href="/app/meditations/oneMinute">
                <button className="bg-brightTeal text-white rounded-lg px-4 py-2">
                  Start
                </button>
              </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <FaHourglassEnd className="text-brightTeal text-4xl mx-auto mb-2" />
              <h2 className="font-bold text-lg mb-2">5-Minute Meditation</h2>
              <Link href="/app/meditations/fiveMinutes">
                <button className="bg-brightTeal text-white rounded-lg px-4 py-2">
                  Start
                </button>
              </Link>
            </div>
          </div>
          <h2 className="text-xl text-darkNavy font-bold mt-8">
            Past Meditations
          </h2>
          {meditations.length > 0 ? (
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-brightTeal text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Icon</th>{" "}
                      {/* New Icon Header */}
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Started At</th>
                      <th className="px-4 py-2 text-left">Completed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meditations.map((meditation) => (
                      <tr key={meditation.id} className="border-b">
                        <td className="px-4 py-2">
                          {" "}
                          {/* Icon Cell */}
                          {meditation.type === "30-Second" && (
                            <FaClock className="text-brightTeal text-xl" />
                          )}
                          {meditation.type === "1-Minute" && (
                            <FaHourglassHalf className="text-brightTeal text-xl" />
                          )}
                          {meditation.type === "5-Minutes" && (
                            <FaHourglassEnd className="text-brightTeal text-xl" />
                          )}
                        </td>
                        <td className="px-4 py-2">{meditation.type}</td>
                        <td className="px-4 py-2">
                          {new Date(meditation.startedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          {meditation.completedAt
                            ? new Date(meditation.completedAt).toLocaleString()
                            : "In Progress"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 mt-4">No past meditations found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meditations;
