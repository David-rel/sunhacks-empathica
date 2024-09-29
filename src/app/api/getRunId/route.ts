import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  defaultHeaders: { "OpenAI-Beta": "assistants=v2" },
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { threadId, botId, message, userId, isFirstMessage } =
      await req.json();

    // Use the environment variable as a fallback for the botId if it's not provided
    const assistantId = botId || process.env.OPENAI_ASSISTANT;

    // Validate the incoming data
    if (!threadId || !assistantId || !message) {
      return NextResponse.json(
        { error: "Thread ID, Assistant ID, and message are required" },
        { status: 400 }
      );
    }

    let additionalContext = "";

    // If it's the first message, fetch user data
    if (isFirstMessage && userId) {
      const userProfile = await prisma.userProfile.findUnique({
        where: { id: userId },
        include: {
          loves: true,
          struggles: true,
          activities: true,
          funFacts: true,
        },
      });

      if (userProfile) {
        // Construct additional context for the AI
        additionalContext = `User Profile Information:\n\n`;
        additionalContext += `Name: ${userProfile.name}\n`;
        additionalContext += `Email: ${userProfile.email}\n`;
        additionalContext += `Username: ${userProfile.username}\n`;
        additionalContext += `Description: ${
          userProfile.description || "N/A"
        }\n\n`;

        // Include loves, struggles, activities, and fun facts
        additionalContext += `Loves:\n${userProfile.loves
          .map((love) => `- ${love.content}`)
          .join("\n")}\n\n`;
        additionalContext += `Struggles:\n${userProfile.struggles
          .map((struggle) => `- ${struggle.content}`)
          .join("\n")}\n\n`;
        additionalContext += `Activities:\n${userProfile.activities
          .map((activity) => `- ${activity.content}`)
          .join("\n")}\n\n`;
        additionalContext += `Fun Facts:\n${userProfile.funFacts
          .map((funFact) => `- ${funFact.content}`)
          .join("\n")}\n\n`;

        // Prepend the user message with the additional context
        additionalContext += `User's Initial Message: ${message}\n\n`;
      }
    }

    // Send the user's message (including additional context if first message) to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: isFirstMessage ? additionalContext : message, // Send the context with the message if it's the first message
    });

    // Create a run with OpenAI API using the threadId and assistantId
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Respond with the run ID
    return NextResponse.json({ runId: run.id });
  } catch (error) {
    console.error("Error starting run:", error);
    return NextResponse.json({ error: "Failed to start run" }, { status: 500 });
  }
}
