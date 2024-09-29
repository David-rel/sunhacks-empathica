import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust the path if your Prisma instance is located elsewhere.

export async function POST(req: NextRequest) {
  try {
    const { userId, type, startedAt, completedAt } = await req.json();

    // Validate the incoming data
    if (!userId || !type || !startedAt) {
      return NextResponse.json(
        { error: "User ID, meditation type, and start time are required" },
        { status: 400 }
      );
    }

    // Create the meditation entry in the database
    const newMeditation = await prisma.meditation.create({
      data: {
        userId,
        type,
        startedAt: new Date(startedAt),
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });

    return NextResponse.json({
      message: "Meditation recorded successfully",
      newMeditation,
    });
  } catch (error) {
    console.error("Error recording meditation:", error);
    return NextResponse.json(
      { error: "Failed to record meditation" },
      { status: 500 }
    );
  }
}
