"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Import react-icons
import { FiSettings } from "react-icons/fi"; // Icon for settings
import Link from "next/link";

interface TopBarProps {
  user: {
    name: string;
    profilePicture?: string;
  };
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Toggle dropdown visibility
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/app/login" });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-softPurple text-darkNavy flex items-center justify-between px-6  z-10">
      {/* Left side - Logo and App Name */}
      <div className="flex items-center space-x-3">
        <Link href="/">
          <Image
            src="/logo.png" // Make sure your logo is in the public folder
            alt="Empathica Logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        <h1 className="text-xl font-bold">Empathica</h1>
      </div>

      {/* Right side - User Profile */}
      <div className="relative flex items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleProfileClick}
        >
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={`${user.name}'s Profile Picture`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-600" />
          )}
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-40 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <ul className="py-1">
              <li className="px-4 py-2 text-gray-800 border-b text-sm">
                Hello, {user.name}
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm">
                <FiSettings className="mr-2" />
                <Link href="/profile">Profile</Link>
              </li>
              <li
                className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
