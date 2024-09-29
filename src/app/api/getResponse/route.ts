// /pages/api/getResponse.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  defaultHeaders: { "OpenAI-Beta": "assistants=v2" },
});

export async function GET(req: NextRequest) {
  const { thread_id, run_id } = Object.fromEntries(
    new URL(req.url).searchParams
  );

  if (!thread_id || !run_id) {
    return NextResponse.json(
      { error: "Thread ID and Run ID are required" },
      { status: 400 }
    );
  }

  try {
    const runResult = await openai.beta.threads.runs.retrieve(
      thread_id,
      run_id
    );
    if (runResult.status === "completed") {
      const messages = await openai.beta.threads.messages.list(thread_id);
      const lastMessage = messages.data.find(
        (msg) => msg.run_id === run_id && msg.role === "assistant"
      );

      const messageContent =
        lastMessage?.content
          .map((contentPart) =>
            "text" in contentPart ? contentPart.text.value : ""
          )
          .join("\n") || "No message found";

      return NextResponse.json({
        status: "completed",
        message: messageContent,
      });
    } else {
      return NextResponse.json({ status: runResult.status });
    }
  } catch (error) {
    console.error("Error retrieving run result", error);
    return NextResponse.json(
      { error: "Error retrieving run result" },
      { status: 500 }
    );
  }
}
