"use client"; // Ensures it runs as a client component
import React from "react";
import { SessionProvider } from "next-auth/react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-lightBlue">
        {/* Ensure full screen height */}
        {children}
      </div>
    </SessionProvider>
  );
};

export default AppLayout;
