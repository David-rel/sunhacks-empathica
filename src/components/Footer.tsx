// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-lightBlue text-darkNavy py-6 px-8 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left Section: Email and Phone */}
        <div className="flex flex-col text-center md:text-left">
          <span className="text-base">Email: support@empathica.com</span>
          <span className="text-base">Phone: (123) 456-7890</span>
        </div>

        {/* Center Section: Logo and Title */}
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png" // Ensure your logo is in the public folder at /public/logo.png
            alt="Empathica Logo"
            width={40}
            height={40}
          />
          <span className="mt-2 text-lg font-bold text-deepBlue">
            Empathica
          </span>
        </div>

        {/* Right Section: Login Link */}
        <div>
          <Link href="/login">
            <span className="text-brightTeal hover:text-skyBlue cursor-pointer font-medium">
              Login
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
