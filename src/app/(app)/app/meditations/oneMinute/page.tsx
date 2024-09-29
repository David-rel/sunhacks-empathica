"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaClock } from "react-icons/fa"; // Import any icons you want to use for styling

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

const ThirtySeconds = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isMeditating, setIsMeditating] = useState(false);
  const [countdown, setCountdown] = useState(60); // 30-second countdown
  const [meditationStartedAt, setMeditationStartedAt] = useState<Date | null>(
    null
  );
  const [meditationCompletedAt, setMeditationCompletedAt] =
    useState<Date | null>(null);

  useEffect(() => {
    // Fetch user data
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
        }
      }
    };
    fetchUserData();
  }, [status, session]);

  // Handle the meditation countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMeditating && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setMeditationCompletedAt(new Date());
      handleEndMeditation(); // Call the function to add the meditation entry
    }
    return () => clearTimeout(timer);
  }, [isMeditating, countdown]);

  // Load YouTube API script for embedding video
  useEffect(() => {
    if (isMeditating) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      let player: YT.Player | undefined;

      // Ensure TypeScript knows about `onYouTubeIframeAPIReady`
      (window as any).onYouTubeIframeAPIReady = function () {
        player = new window.YT.Player("youtube-player", {
          videoId: "PpUxWOtHh6w", // Video ID
          playerVars: {
            start: 0, 
            controls: 0, // Hide all controls
            modestbranding: 1,
            autoplay: 1,
            rel: 0,
            fs: 0,
            disablekb: 1,
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(100); // Set volume to full
            },
          },
        });
      };

      return () => {
        if (player) {
          player.destroy();
        }
      };
    }
  }, [isMeditating]);

  const handleStartMeditation = () => {
    setMeditationStartedAt(new Date());
    setIsMeditating(true);
  };

  const handleEndMeditation = async () => {
    setIsMeditating(false);
    // Send the data to your API to record the meditation session
    try {
      const response = await fetch(`/api/addMeditation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.id,
          type: "1-Minute",
          startedAt: meditationStartedAt,
          completedAt: new Date(),
        }),
      });
      if (response.ok) {
        alert("Meditation session recorded successfully!");
        router.push("/app/meditations"); // Redirect to meditations page
      } else {
        console.error("Failed to add meditation session");
        alert("An error occurred while recording your meditation session.");
      }
    } catch (error) {
      console.error("Error adding meditation session:", error);
      alert("An error occurred while recording your meditation session.");
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-gray-100 transition-all duration-300 pt-12">
      {/* Sidebar and TopBar */}
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
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-darkNavy mb-4">
              {isMeditating
                ? "Meditating..."
                : "Start Your 1-Minute Meditation"}
            </h1>
            {isMeditating ? (
              <>
                <div className="text-6xl font-bold text-brightTeal mb-4">
                  {countdown}
                </div>
                {/* YouTube video embed */}
                <div
                  className="relative w-full h-0"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    id="youtube-player"
                    title="Meditation Video"
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/PpUxWOtHh6w?autoplay=1&controls=0&modestbranding=1&fs=0&rel=0&disablekb=1"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen={false}
                    style={{ position: "absolute", top: 0, left: 0 }}
                  ></iframe>
                </div>
              </>
            ) : (
              <button
                onClick={handleStartMeditation}
                className="bg-brightTeal text-white py-2 px-6 rounded-md mt-4 text-lg hover:bg-teal-600 transition"
              >
                <FaClock className="inline-block mr-2" />
                Start Meditation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirtySeconds;
