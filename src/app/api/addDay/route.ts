import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if an entry already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    const existingTask = await prisma.dailyMentalHealthTask.findFirst({
      where: {
        userId: userId,
        date: today,
      },
    });

    if (existingTask) {
      return NextResponse.json(
        { message: "Task for today already exists" },
        { status: 400 }
      );
    }

    // Create a new task entry for today
    const newTask = await prisma.dailyMentalHealthTask.create({
      data: {
        userId: userId,
        date: today,
        meditationCompleted: false,
        journalingCompleted: false,
        mealsCompleted: false,
        sleepCompleted: false,
        exerciseCompleted: false,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
