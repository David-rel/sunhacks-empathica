import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  defaultHeaders: { "OpenAI-Beta": "assistants=v2" },
});

export async function POST(req: NextRequest) {
  try {
    const { threadId, botId, message } = await req.json();

    // Validate the incoming data
    if (!threadId || !botId || !message) {
      return NextResponse.json(
        { error: "Thread ID, Bot ID, and message are required" },
        { status: 400 }
      );
    }

    // Send the user's message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // Create a run with OpenAI API using the threadId and botId
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: botId,
    });

    // Respond with the run ID
    return NextResponse.json({ runId: run.id });
  } catch (error) {
    console.error("Error starting run:", error);

    // Return error response
    return NextResponse.json({ error: "Failed to start run" }, { status: 500 });
  }
}
