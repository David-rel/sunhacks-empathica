"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";

// Define the UserProfile type based on the data structure you expect
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

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null); // Use UserProfile type
  const [loading, setLoading] = useState(true);

  // Fetch user data from the API using the session user ID
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/getUser?id=${session.user.id}`);
          if (response.ok) {
            const data: UserProfile = await response.json(); // Cast the data to UserProfile type
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

  // Redirect to the login page if not authenticated
  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-lightBlue">
      {/* Include Sidebar and pass user data */}
      <Sidebar
        user={{
          name: userData?.name || "",
          profilePicture: userData?.profilePicture,
        }}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-56">
        {" "}
        {/* Adjusted for the new sidebar width */}
        {/* Include Top Bar */}
        <TopBar
          user={{
            name: userData?.name || "",
            profilePicture: userData?.profilePicture,
          }}
        />
        {/* Main Content */}
        <div className="flex items-center justify-center mt-10 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-2xl font-bold text-darkNavy mb-4">
              Welcome, {userData?.name || session?.user?.email}
            </h1>
            <p className="mb-6">You are logged in as {userData?.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
