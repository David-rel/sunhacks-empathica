// /app/api/createJournal/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust path based on your project structure

export async function POST(req: NextRequest) {
  const { userId, title, description } = await req.json();

  if (!userId || !title || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const journal = await prisma.journal.create({
      data: {
        userId,
        title,
        description,
      },
    });
    return NextResponse.json(journal);
  } catch (error) {
    console.error("Error creating journal:", error);
    return NextResponse.json(
      { error: "Failed to create journal" },
      { status: 500 }
    );
  }
}
