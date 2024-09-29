import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Adjust this path
export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const { taskId, field, value } = await req.json();

    console.log("Received data:", { taskId, field, value });

    if (!taskId || !field || typeof value !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.dailyMentalHealthTask.update({
      where: { id: taskId },
      data: {
        [field]: value,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
