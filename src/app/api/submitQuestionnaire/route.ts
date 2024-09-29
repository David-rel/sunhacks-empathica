import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Update the user profile with questionnaire data
    const updatedUser = await prisma.userProfile.update({
      where: {
        id: body.userId,
      },
      data: {
        meditation: body.meditation,
        journaling: body.journaling,
        meals: body.meals,
        sleep: body.sleep,
        exercise: body.exercise,
        questionaireComplete: true, // Ensure correct spelling
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const message = (error as Error).message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
