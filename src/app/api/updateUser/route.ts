import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust the path as needed for your Prisma client

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const userId = data.userId;

    if (!data || !userId) {
      return NextResponse.json(
        { error: "Invalid data or user ID" },
        { status: 400 }
      );
    }

    // Update the user profile using Prisma
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: {
        name: data.name,
        username: data.username,
        profilePicture: data.profilePicture,
        description: data.description,
        loves: {
          deleteMany: {}, // Delete existing loves
          create: data.loves.map((love: string) => ({ content: love })), // Change to content
        },
        struggles: {
          deleteMany: {}, // Delete existing struggles
          create: data.struggles.map((struggle: string) => ({
            content: struggle,
          })), // Change to content
        },
        activities: {
          deleteMany: {}, // Delete existing activities
          create: data.activities.map((activity: string) => ({
            content: activity,
          })), // Change to content
        },
        funFacts: {
          deleteMany: {}, // Delete existing fun facts
          create: data.funFacts.map((funFact: string) => ({
            content: funFact,
          })), // Change to content
        },
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
