import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the path to your Prisma instance

export async function GET(request: NextRequest) {
  try {
    // Extract the user ID from the URL search parameters
    const userId = request.nextUrl.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user data, excluding array relationships
    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        profilePicture: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        questionaireComplete: true,
        meditation: true,
        journaling: true,
        meals: true,
        sleep: true,
        exercise: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
