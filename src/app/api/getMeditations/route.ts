import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get the search parameters from the request
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch meditations for the user
    const meditations = await prisma.meditation.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
    });

    // Filter to get every other meditation (1st, 3rd, 5th, etc.)
    const filteredMeditations = meditations.filter(
      (_, index) => index % 2 === 0
    );

    return NextResponse.json(filteredMeditations, { status: 200 });
  } catch (error) {
    console.error("Error fetching meditations:", error);
    return NextResponse.json(
      { error: "Failed to retrieve meditations" },
      { status: 500 }
    );
  }
}
