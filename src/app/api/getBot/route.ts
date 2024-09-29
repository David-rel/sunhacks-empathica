import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  defaultHeaders: { "OpenAI-Beta": "assistants=v2" },
});


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId; // Make sure the userId is sent in the request body

    console.log("Starting to create a new thread...");

    // Retrieve the assistant details from OpenAI
    const assistant = await openai.beta.assistants.retrieve(
      process.env.OPENAI_ASSISTANT as string
    );
    console.log("Assistant retrieved:", assistant);

    // Create a new thread using OpenAI
    const thread = await openai.beta.threads.create();
    console.log("Created thread:", thread);

    // Store the threadId in the user's chat in your database
    const newChat = await prisma.chat.create({
      data: {
        threadsId: thread.id, // Save the thread ID from OpenAI
        userProfileId: userId, // Save the user profile ID
      },
    });
    console.log("Saved chat to the database:", newChat);

    // Return the assistant and newly created thread details in the JSON response
    return NextResponse.json({
      threadId: thread.id, // Assuming thread has an 'id' property
      botId: assistant.id, // Assuming assistant has an 'id' property
    });
  } catch (error) {
    console.error("Error retrieving OpenAI information", error);
    return new Response("Error retrieving OpenAI information", { status: 500 });
  }
}
