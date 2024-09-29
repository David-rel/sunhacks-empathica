import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define the paths where you want the middleware to run
const protectedPaths = [
  "/app",
  "/app/meditations",
  "/app/journal",
  "/app/health-tracker",
  "/app/profile",
];

export async function middleware(request: NextRequest) {
  // Retrieve the token from the request using NextAuth's getToken method
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get the requested path
  const path = request.nextUrl.pathname;

  // Allow access to login, sign-in, and signup pages for unauthenticated users
  if (
    path === "/app/login" ||
    path === "/app/signIn" ||
    path === "/app/signup"
  ) {
    return NextResponse.next();
  }

  // Check if the path is protected
  if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    // If no token is found, redirect to the login page
    if (!token) {
      const signInUrl = new URL("/app/login", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow the request to proceed for both logged-in and non-logged-in users
  return NextResponse.next();
}

// Specify paths for the middleware to apply to
export const config = {
  matcher: [
    "/app/:path*",
    "/app/meditations/:path*",
    "/app/journal/:path*",
    "/app/health-tracker/:path*",
    "/app/profile/:path*",
  ],
};
