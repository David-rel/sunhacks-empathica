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
  questionaireComplete: boolean;
  meditation: string;
  journaling: string;
  meals: string;
  sleep: string;
  exercise: string;
}

interface DailyMentalHealthTask {
  id: string;
  date: string;
  meditationCompleted: boolean; // Change to boolean
  journalingCompleted: boolean; // Change to boolean
  mealsCompleted: boolean; // Change to boolean
  sleepCompleted: boolean; // Change to boolean
  exerciseCompleted: boolean; // Change to boolean
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<DailyMentalHealthTask[]>([]);

  // Fetch user data and tasks
  useEffect(() => {
    const fetchUserDataAndTasks = async () => {
      if (status !== "authenticated" || !session?.user?.id) return;
      try {
        const response = await fetch(`/api/getUser?id=${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data: UserProfile = await response.json();
        setUserData(data);

        // Redirect to the questionnaire page if incomplete
        if (!data.questionaireComplete) {
          router.push("/app/health-tracker");
          return;
        }

        // Fetch health tasks
        const tasksResponse = await fetch(`/api/getHealth`, {
          headers: { userId: session.user.id },
        });
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
        const taskData: DailyMentalHealthTask[] = await tasksResponse.json();
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserDataAndTasks();
    }
  }, [status, session, router]);

  const handleCheckboxChange = async (
    taskId: string,
    field: keyof DailyMentalHealthTask
  ) => {
    // Find the task that is being updated
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    // Determine the new value by toggling the current value
    const currentValue = taskToUpdate[field];
    const newValue = !currentValue; // Toggle the boolean value

    // Optimistically update the UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, [field]: newValue } : task
      )
    );

    // Send API request to update the task in the database
    try {
      const response = await fetch(`/api/updateTask`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          field,
          value: newValue,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      // Confirm the backend update
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, [field]: updatedTask[field] } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      // Rollback UI state if API request fails
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, [field]: currentValue } : task
        )
      );
    }
  };

  if (status === "loading" || loading) return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/app/login");
    return null;
  }

  // Render tasks in a grid layout
  const renderTaskGrid = () => {
    return tasks.map((task, index) => (
      <div
        key={task.id}
        className="border-2 bg-white border-softBlue p-4 rounded-lg"
      >
        <h3 className="font-bold text-darkNavy">
          Day {index + 1}: {new Date(task.date).toLocaleDateString()}
        </h3>
        <div className="space-y-2 mt-2">
          {[
            {
              label: `Meditation: ${userData?.meditation}`,
              field: "meditationCompleted",
            },
            {
              label: `Journaling: ${userData?.journaling}`,
              field: "journalingCompleted",
            },
            { label: `Meals: ${userData?.meals}`, field: "mealsCompleted" },
            { label: `Sleep: ${userData?.sleep}`, field: "sleepCompleted" },
            {
              label: `Exercise: ${userData?.exercise}`,
              field: "exerciseCompleted",
            },
          ].map(({ label, field }) => (
            <label key={field} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task[field as keyof DailyMentalHealthTask] === true}
                onChange={() =>
                  handleCheckboxChange(
                    task.id,
                    field as keyof DailyMentalHealthTask
                  )
                }
                className="text-brightTeal"
              />
              <span
                className={`capitalize ${
                  task[field as keyof DailyMentalHealthTask]
                    ? "line-through text-gray-500"
                    : ""
                }`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    ));
  };

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
          <div className="bg-lightBlue p-8 ">
            <h1 className="text-2xl font-bold text-darkNavy">
              Your Health Tasks
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {renderTaskGrid()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
