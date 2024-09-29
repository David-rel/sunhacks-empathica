import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("userId"); // Make sure you pass userId from the frontend

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch all DailyMentalHealthTask entries for the user
    let tasks = await prisma.dailyMentalHealthTask.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: "asc",
      },
    });

    // If there are no tasks, create the first one for today
    if (tasks.length === 0) {
      const todayTask = await prisma.dailyMentalHealthTask.create({
        data: {
          userId: userId,
          date: new Date(),
        },
      });
      tasks = [todayTask];
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
