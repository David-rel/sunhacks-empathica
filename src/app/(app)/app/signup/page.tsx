"use client"; // Ensures it runs as a client component in Next.js 14
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Success state for showing the popup
  const [showPassword, setShowPassword] = useState(false); // Toggle state for password visibility
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Sending data to your Next.js API route
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (response.ok) {
        // Show the success message
        setSuccess(true);

        // Clear form fields
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");

        // Redirect to the login page after a delay
        setTimeout(() => {
          router.push("/app/login");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Error signing up. Please try again.");
      }
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBlue">
      <form
        onSubmit={handleSignUp}
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
            Sign Up for Empathica
          </h2>
        </div>

        {/* Success Popup */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            Account created successfully! You will be redirected to the login
            page shortly.
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Sign Up
        </button>

        {/* Link to Sign In */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/app/login">
            <span className="text-brightTeal hover:text-skyBlue cursor-pointer font-semibold">
              Sign In
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
