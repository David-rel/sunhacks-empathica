"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing"; // Adjust path as needed

// Define the UserProfile type based on the data structure you expect
interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
  password?: string;
  description?: string;
  loves: string[]; // Ensure these are arrays
  struggles: string[];
  activities: string[];
  funFacts: string[];
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/getAllUser?id=${session.user.id}`);
          if (response.ok) {
            const data: UserProfile = await response.json();
            // Initialize empty arrays if they're undefined
            setUserData({
              ...data,
              loves: data.loves || [],
              struggles: data.struggles || [],
              activities: data.activities || [],
              funFacts: data.funFacts || [],
            });
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

  // Helper functions
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUserData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          [field]: value,
        };
      }
      return prevData;
    });
  };

  const handleAddItem = (field: keyof UserProfile) => {
    setUserData((prevData) => {
      if (prevData) {
        const currentField = Array.isArray(prevData[field])
          ? prevData[field]
          : []; // Ensure it's an array
        return {
          ...prevData,
          [field]: [...currentField, ""], // Add an empty string as a new item
        };
      }
      return prevData;
    });
  };

  const handleRemoveItem = (field: keyof UserProfile, index: number) => {
    setUserData((prevData) => {
      if (prevData) {
        const updatedField = Array.isArray(prevData[field])
          ? prevData[field].filter((_, i) => i !== index)
          : []; // Ensure it's an array
        return {
          ...prevData,
          [field]: updatedField,
        };
      }
      return prevData;
    });
  };

  // Handle input changes for array fields
  const handleArrayChange = (
    field: keyof UserProfile,
    index: number,
    value: string
  ) => {
    setUserData((prevData) => {
      if (prevData) {
        // Ensure we're only working with an array
        const currentArray = Array.isArray(prevData[field])
          ? prevData[field]
          : []; // Default to an empty array if not

        // Create a new array with the updated value at the specified index
        const updatedArray = [...currentArray];
        if (index >= 0 && index < updatedArray.length) {
          updatedArray[index] = value; // Update the value at the specified index
        }
        return {
          ...prevData,
          [field]: updatedArray, // Update the field with the new array
        };
      }
      return prevData;
    });
  };

  const handleProfileImageUpload = (imageUrl: string) => {
    setUserData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          profilePicture: imageUrl,
        };
      }
      return prevData;
    });
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      alert("User ID is missing from the session.");
      return;
    }
    try {
      const response = await fetch(`/api/updateUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id, // Send the user ID along with the user data
          name: userData?.name,
          username: userData?.username,
          profilePicture: userData?.profilePicture,
          description: userData?.description,
          loves: userData?.loves,
          struggles: userData?.struggles,
          activities: userData?.activities,
          funFacts: userData?.funFacts,
        }),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Define the array fields as constants
  const arrayFields = ["loves", "struggles", "activities", "funFacts"] as const;
  type ArrayFields = (typeof arrayFields)[number];

  return (
    <div className="flex min-h-screen bg-lightBlue pt-20 pb-20">
      <Sidebar
        user={{
          name: userData?.name || "",
          profilePicture: userData?.profilePicture,
        }}
      />
      <div className="flex-1 ml-56">
        <TopBar
          user={{
            name: userData?.name || "",
            profilePicture: userData?.profilePicture,
          }}
        />
        <div className="flex flex-col items-center justify-center mt-10 px-6">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <Image
                src={userData?.profilePicture || "/default.png"}
                alt="User Profile"
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    handleProfileImageUpload(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error);
                }}
              />
            </div>
            {/* Basic Info Fields */}
            <div className="space-y-4">
              {["name", "username"].map((field) => (
                <div key={field}>
                  <label className="block text-left text-lg font-semibold text-darkNavy capitalize">
                    {field}:
                  </label>
                  <input
                    type="text"
                    value={userData?.[field as keyof UserProfile] || ""}
                    onChange={(e) =>
                      handleInputChange(
                        field as keyof UserProfile,
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
              {/* Description Field */}
              <div>
                <label className="block text-left text-lg font-semibold text-darkNavy">
                  Description:
                </label>
                <textarea
                  value={userData?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Enter your description"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">
                  {userData?.description?.length || 0}/200
                </p>
              </div>
            </div>
            {arrayFields.map((field) => (
              <div key={field} className="w-full mt-6 mb-6">
                <label className="text-xl font-semibold text-darkNavy capitalize">
                  {field}:
                </label>
                <button
                  type="button"
                  onClick={() => handleAddItem(field)}
                  className="ml-2 px-2 py-1 bg-brightTeal text-white rounded hover:bg-skyBlue"
                >
                  Add {field.slice(0, -1)}
                </button>
                {((userData?.[field] || []) as string[]).map((item, index) => (
                  <div key={index} className="mt-4">
                    <textarea
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(field, index, e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-md mb-2"
                      placeholder={`Enter your ${field.slice(0, -1)}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(field, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ))}
            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="mt-6 px-4 py-2 bg-brightTeal text-white rounded hover:bg-skyBlue"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
