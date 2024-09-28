// app/page.tsx
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";
import { WobbleCard } from "@/components/ui/wobble-card";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Footer from "@/components/Footer";

export default function HomePage() {
  // Typewriter words
  const words = [
    { text: "Start" },
    { text: "your" },
    { text: "mental" },
    { text: "wellness" },
    { text: "journey" },
    { text: "with" },
    { text: "Empathica.", className: "text-brightTeal" },
  ];

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lightBlue via-white to-lightBlue text-darkNavy pt-20 pb-20">
        <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 xl:py-24 xl:flex-row xl:justify-between gap-10">
          {/* Image Section */}
          <div className="flex items-center justify-center lg:w-1/2">
            <Image
              src="/front.jpg" // Ensure the image is in the public folder as /public/front.jpg
              alt="AI providing mental health support"
              width={1000}
              height={500}
              className="object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Text Content Section */}
          <div className="flex flex-col justify-center text-center lg:text-left lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-deepBlue mb-4">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-brightTeal via-skyBlue to-softPurple">
                Empathica
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-darkTeal leading-relaxed">
              Empathica offers compassionate, AI-driven mental health support.
              Discover tools that provide empathy, guidance, and personalized
              care, all tailored to enhance your mental well-being.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/app/signup">
                <button className="px-6 py-3 bg-brightTeal text-white font-bold rounded-md hover:bg-skyBlue transition duration-300">
                  Get Started
                </button>
              </Link>
              <Link href="/app/login">
                <button className="px-6 py-3 bg-softPurple text-white font-bold rounded-md hover:bg-lavender transition duration-300">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className=" w-screen px-8 py-16 bg-lightTeal">
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto">
          {/* First Card */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-lightBlue min-h-[500px] lg:min-h-[300px] rounded-lg shadow-lg">
            <div className="relative z-10 max-w-sm">
              <h2 className="text-left text-xl lg:text-3xl font-semibold text-deepBlue mb-4">
                Empathica - Your AI-Driven Mental Health Companion
              </h2>
              <p className="text-left text-base text-darkTeal">
                Experience compassionate support tailored to your needs. Our AI
                is here to help you navigate life&apos;s challenges with
                understanding and care.
              </p>
              <Link href="/app/signup">
                <button className="mt-6 px-6 py-3 bg-brightTeal text-white rounded-md hover:bg-skyBlue transition duration-300">
                  Get Started
                </button>
              </Link>
            </div>
            <Image
              src="/front.jpg"
              width={500}
              height={500}
              alt="Empathica demo image"
              className="absolute -right-4 lg:-right-[40%] -bottom-10 object-contain rounded-2xl z-0 shadow-lg"
            />
          </WobbleCard>

          {/* Second Card */}
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-softPurple rounded-lg shadow-lg">
            <div className="relative z-10 max-w-sm">
              <h2 className="text-left text-xl lg:text-3xl font-semibold text-deepBlue mb-4">
                Tailored Support for Every Journey
              </h2>
              <p className="text-left text-base text-gray-700">
                Whether you’re looking for guidance, relaxation techniques, or
                self-discovery, Empathica provides the tools to support your
                mental well-being.
              </p>
              <Link href="/app/signup">
                <button className="mt-6 px-6 py-3 bg-brightTeal text-white rounded-md hover:bg-skyBlue transition duration-300">
                  Get Started
                </button>
              </Link>
            </div>
          </WobbleCard>

          {/* Third Card */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-lavender min-h-[500px] rounded-lg shadow-lg">
            <div className="relative z-10 max-w-md">
              <h2 className="text-left text-xl lg:text-3xl font-semibold text-deepBlue mb-4">
                Personalized Content and Mental Health Resources
              </h2>
              <p className="text-left text-base text-darkTeal">
                With Empathica, access personalized chats, guided meditations,
                and tools designed to support your mental health journey.
              </p>
              <Link href="/app/signup">
                <button className="mt-6 px-6 py-3 bg-brightTeal text-white rounded-md hover:bg-skyBlue transition duration-300">
                  Start a Conversation
                </button>
              </Link>
            </div>
            <Image
              src="/front.jpg"
              width={500}
              height={500}
              alt="Empathica content creation"
              className="absolute -right-10 lg:-right-[20%] -bottom-10 object-contain rounded-2xl z-0 shadow-lg"
            />
          </WobbleCard>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="flex flex-col items-center justify-center mt-20 bg-white pb-20 pt-10">
        <p className="text-darkTeal text-xl mb-4">
          Your Journey to Mental Wellness Starts Here
        </p>
        <TypewriterEffectSmooth words={words} />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-6">
          <Link href="/app/signup">
            <button className="w-40 h-10 rounded-xl bg-brightTeal border border-transparent text-white text-sm hover:bg-skyBlue transition duration-300">
              Start for Free
            </button>
          </Link>
          <Link href="/app/login">
            <button className="w-40 h-10 rounded-xl bg-white text-darkNavy border border-darkNavy text-sm hover:bg-lightBlue transition duration-300">
              Login Now
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
