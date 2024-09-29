import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const meditations = await prisma.meditation.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
    });

    // Filter to get every other meditation (1st, 3rd, 5th, etc.)
    const filteredMeditations = meditations.filter(
      (_, index) => index % 2 === 0
    );

    return NextResponse.json(filteredMeditations);
  } catch (error) {
    console.error("Error fetching meditations:", error);
    return NextResponse.json(
      { error: "Failed to retrieve meditations" },
      { status: 500 }
    );
  }
}
