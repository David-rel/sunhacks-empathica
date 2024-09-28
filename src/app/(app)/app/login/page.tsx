"use client"; // Ensures it runs as a client component in Next.js 14
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // This will be email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state for password visibility
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Use NextAuth's signIn method
    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    if (result?.error) {
      setError("Invalid login credentials. Please try again.");
    } else {
      // Redirect to the main app page upon successful login
      router.push("/app");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBlue">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png" // Ensure your logo.png is in the public folder
            alt="Empathica Logo"
            width={60}
            height={60}
          />
          <h2 className="text-2xl font-bold mt-3 text-center text-darkNavy">
            Login to Empathica
          </h2>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Email or Username</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-8 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-brightTeal hover:bg-skyBlue text-white py-2 rounded-md transition duration-300"
        >
          Log In

        </button>

        {/* Link to Sign Up */}
        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/app/signup">
            <span className="text-brightTeal hover:text-skyBlue cursor-pointer font-semibold">
              Sign Up
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
