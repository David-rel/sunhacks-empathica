import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust the path as needed

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      include: {
        loves: true,
        struggles: true,
        activities: true,
        funFacts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Flatten the data structure for easier handling on the front end
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      description: user.description,
      loves: user.loves.map((item) => item.content),
      struggles: user.struggles.map((item) => item.content),
      activities: user.activities.map((item) => item.content),
      funFacts: user.funFacts.map((item) => item.content),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
