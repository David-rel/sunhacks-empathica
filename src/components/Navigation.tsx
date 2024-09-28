import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  return (
    <nav className="w-full bg-lightBlue shadow-md py-4 px-6 fixed top-0 left-0 flex justify-between items-center z-20">
      {/* Left Section: Logo and Name */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image src="/logo.png" alt="Empathica Logo" width={60} height={32} />
        </Link>
        <span className="text-2xl font-bold text-darkNavy">Empathica</span>
      </div>

      {/* Center Section: Slogan */}
      <div className="hidden md:block">
        <span className="text-deepBlue font-medium text-xl">
          &quot;Where AI Meets Human Understanding&quot;
        </span>
      </div>

      {/* Right Section: Login Link */}
      <div>
        <Link href="/app/login">
          <span className="text-brightTeal hover:text-skyBlue underline cursor-pointer font-medium text-lg">
            Login
          </span>
        </Link>
      </div>
    </nav>
  );
}
