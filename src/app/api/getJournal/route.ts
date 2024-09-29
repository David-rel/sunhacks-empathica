import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust the path if your Prisma instance is located elsewhere.

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get("id");
    const userId = searchParams.get("userId");

    console.log("Received journalId:", journalId);
    console.log("Received userId:", userId);

    // Validate the incoming data
    if (!journalId || !userId) {
      return NextResponse.json(
        { error: "Journal ID and User ID are required" },
        { status: 400 }
      );
    }

    // Fetch the journal entry from the database
    const journal = await prisma.journal.findFirst({
      where: {
        id: journalId,
        userId: userId, // Ensure we fetch the journal only for the specific user
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!journal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    // Return the journal data
    return NextResponse.json(journal, { status: 200 });
  } catch (error) {
    console.error("Error fetching journal:", error);
    return NextResponse.json(
      { error: "Failed to retrieve journal" },
      { status: 500 }
    );
  }
}
