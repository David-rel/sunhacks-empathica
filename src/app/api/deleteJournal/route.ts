import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust the path if your Prisma instance is located elsewhere.
export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get("id");

    // Validate the incoming data
    if (!journalId) {
      return NextResponse.json(
        { error: "Journal ID is required" },
        { status: 400 }
      );
    }

    // Delete the journal entry from the database
    await prisma.journal.delete({
      where: { id: journalId },
    });

    return NextResponse.json(
      { message: "Journal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting journal:", error);
    return NextResponse.json(
      { error: "Failed to delete journal" },
      { status: 500 }
    );
  }
}
