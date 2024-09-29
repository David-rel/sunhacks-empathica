import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust the path to your Prisma instance

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description } = await req.json();

    // Validate the incoming data
    if (!id || !title) {
      return NextResponse.json(
        { error: "Journal ID and title are required" },
        { status: 400 }
      );
    }

    // Update the journal entry
    const updatedJournal = await prisma.journal.update({
      where: { id },
      data: {
        title,
        description,
        updatedAt: new Date(), // Automatically update the `updatedAt` field
      },
    });

    return NextResponse.json({
      message: "Journal updated successfully",
      updatedJournal,
    });
  } catch (error) {
    console.error("Error updating journal:", error);
    return NextResponse.json(
      { error: "Failed to update journal" },
      { status: 500 }
    );
  }
}
