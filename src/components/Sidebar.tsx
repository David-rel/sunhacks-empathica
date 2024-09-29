"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaCommentDots,
  FaBrain,
  FaBook,
  FaHeartbeat,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";

interface User {
  name: string;
  profilePicture?: string;
}

interface SidebarProps {
  user: User;
}

const menuItems = [
  { name: "Chat", path: "/app", icon: <FaCommentDots /> },
  { name: "Meditations", path: "/app/meditations", icon: <FaBrain /> },
  { name: "Journal", path: "/app/journal", icon: <FaBook /> },
  {
    name: "Health Tracker",
    path: "/app/health-tracker",
    icon: <FaHeartbeat />,
  },
  { name: "Profile", path: "/app/profile", icon: <FaUser /> },
];

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const currentPath = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-56 bg-softPurple p-4 shadow-lg flex flex-col justify-between">
      {/* Top Section */}
      <div className="mt-16">
        {" "}
        {/* Push content down below top bar */}
        <h2 className="text-xl font-bold text-darkNavy mb-4 border-b-2 border-darkNavy pb-2">
          Navigation
        </h2>
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`flex items-center space-x-3 p-2 my-2 rounded-md cursor-pointer transition-colors ${
                currentPath === item.path
                  ? "bg-brightTeal text-white"
                  : "text-darkNavy hover:bg-skyBlue hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-semibold">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Section - User Info */}
      <div className="flex items-center p-2 bg-white rounded-md shadow-sm text-darkNavy space-x-3 mt-auto">
        {user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <FaUser className="w-10 h-10 text-gray-600" />
        )}
        <div>
          <p className="text-sm font-semibold">{user.name}</p>
          <Link href="/app/profile">
            <p className="text-xs text-brightTeal hover:underline cursor-pointer">
              View Profile
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
