import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust this path if needed
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Extract the user ID from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch threads associated with the user from the Prisma database
    const threads = await prisma.chat.findMany({
      where: { userProfileId: userId },
      select: {
        id: true,
        threadsId: true,
        createdAt: true,
      },
    });

    // Return the list of threads
    return NextResponse.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}
