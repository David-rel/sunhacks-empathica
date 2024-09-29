"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
  meditation?: string;
  journaling?: string;
  meals?: string;
  sleep?: string;
  exercise?: string;
  questionaireComplete: boolean;
}

const HealthTracker = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // State for questionnaire form data
  const [formData, setFormData] = useState({
    meditation: "",
    meditationExplanation: "",
    journaling: "",
    journalingExplanation: "",
    meals: "",
    mealsExplanation: "",
    sleep: "",
    sleepExplanation: "",
    exercise: "",
    exerciseExplanation: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/getUser?id=${session.user.id}`);
          if (response.ok) {
            const data: UserProfile = await response.json();
            setUserData(data);

            if (data.questionaireComplete) {
              router.push("/app/health-tracker/dashboard");
            }
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
  }, [status, session, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Adjust formData to replace "More" answers with the explanation text
    const adjustedFormData = {
      meditation:
        formData.meditation === "More"
          ? formData.meditationExplanation
          : formData.meditation,
      journaling:
        formData.journaling === "More"
          ? formData.journalingExplanation
          : formData.journaling,
      meals:
        formData.meals === "More" ? formData.mealsExplanation : formData.meals,
      sleep:
        formData.sleep === "More" ? formData.sleepExplanation : formData.sleep,
      exercise:
        formData.exercise === "More"
          ? formData.exerciseExplanation
          : formData.exercise,
      userId: userData?.id,
    };

    try {
      const response = await fetch("/api/submitQuestionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustedFormData),
      });

      if (response.ok) {
        alert("Questionnaire submitted successfully!");
        router.push("/app/health-tracker/dashboard");
      } else {
        console.error("Failed to submit questionnaire");
        alert("An error occurred while submitting your questionnaire.");
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      alert("An error occurred while submitting your questionnaire.");
    }
  };

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-background transition-all duration-300 pt-12 text-foreground">
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
          <div className="bg-lightBlue p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-darkNavy mb-4">
              Health Tracker
            </h1>
            {userData && !userData.questionaireComplete ? (
              <form className="space-y-4 text-left">
                {/* Question 1: Meditation per day */}
                <div>
                  <label className="block text-darkNavy font-medium">
                    Meditation per day:
                  </label>
                  <div className="space-y-2">
                    {["1 a day", "2 a day", "3 a day", "More"].map((option) => (
                      <label
                        className="flex items-center space-x-2"
                        key={option}
                      >
                        <input
                          type="radio"
                          name="meditation"
                          value={option}
                          checked={formData.meditation === option}
                          onChange={handleChange}
                          className="text-brightTeal"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                    {formData.meditation === "More" && (
                      <textarea
                        name="meditationExplanation"
                        placeholder="Explain"
                        value={formData.meditationExplanation}
                        onChange={handleChange}
                        className="border border-softPurple rounded-md px-3 py-1 w-full"
                      />
                    )}
                  </div>
                </div>

                {/* Question 2: Journaling per day */}
                <div>
                  <label className="block text-darkNavy font-medium">
                    Journaling per day:
                  </label>
                  <div className="space-y-2">
                    {["1 a day", "2 a day", "More"].map((option) => (
                      <label
                        className="flex items-center space-x-2"
                        key={option}
                      >
                        <input
                          type="radio"
                          name="journaling"
                          value={option}
                          checked={formData.journaling === option}
                          onChange={handleChange}
                          className="text-brightTeal"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                    {formData.journaling === "More" && (
                      <textarea
                        name="journalingExplanation"
                        placeholder="Explain"
                        value={formData.journalingExplanation}
                        onChange={handleChange}
                        className="border border-softPurple rounded-md px-3 py-1 w-full"
                      />
                    )}
                  </div>
                </div>

                {/* Question 3: Meals per day */}
                <div>
                  <label className="block text-darkNavy font-medium">
                    How many meals do you want to eat a day?
                  </label>
                  <div className="space-y-2">
                    {["1", "2", "3", "More"].map((option) => (
                      <label
                        className="flex items-center space-x-2"
                        key={option}
                      >
                        <input
                          type="radio"
                          name="meals"
                          value={option}
                          checked={formData.meals === option}
                          onChange={handleChange}
                          className="text-brightTeal"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                    {formData.meals === "More" && (
                      <textarea
                        name="mealsExplanation"
                        placeholder="Explain"
                        value={formData.mealsExplanation}
                        onChange={handleChange}
                        className="border border-softPurple rounded-md px-3 py-1 w-full"
                      />
                    )}
                  </div>
                </div>

                {/* Question 4: Hours of sleep per day */}
                <div>
                  <label className="block text-darkNavy font-medium">
                    How many hours of sleep do you want on average per day?
                  </label>
                  <div className="space-y-2">
                    {["6", "8", "10", "More"].map((option) => (
                      <label
                        className="flex items-center space-x-2"
                        key={option}
                      >
                        <input
                          type="radio"
                          name="sleep"
                          value={option}
                          checked={formData.sleep === option}
                          onChange={handleChange}
                          className="text-brightTeal"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                    {formData.sleep === "More" && (
                      <textarea
                        name="sleepExplanation"
                        placeholder="Explain"
                        value={formData.sleepExplanation}
                        onChange={handleChange}
                        className="border border-softPurple rounded-md px-3 py-1 w-full"
                      />
                    )}
                  </div>
                </div>

                {/* Question 5: Exercise per day */}
                <div>
                  <label className="block text-darkNavy font-medium">
                    How much exercise do you want to get a day?
                  </label>
                  <div className="space-y-2">
                    {["30 mins", "45 mins", "1 hour", "More"].map((option) => (
                      <label
                        className="flex items-center space-x-2"
                        key={option}
                      >
                        <input
                          type="radio"
                          name="exercise"
                          value={option}
                          checked={formData.exercise === option}
                          onChange={handleChange}
                          className="text-brightTeal"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                    {formData.exercise === "More" && (
                      <textarea
                        name="exerciseExplanation"
                        placeholder="Explain"
                        value={formData.exerciseExplanation}
                        onChange={handleChange}
                        className="border border-softPurple rounded-md px-3 py-1 w-full"
                      />
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-brightTeal text-white py-2 px-6 rounded-md mt-4 text-lg hover:bg-deepBlue transition"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>Your questionnaire is complete.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
