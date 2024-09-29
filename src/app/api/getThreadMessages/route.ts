import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  defaultHeaders: { "OpenAI-Beta": "assistants=v2" },
});

interface ContentItem {
  type: string;
  text?: string | TextObject[] | TextObject; // Text can be a string, an array, or an object
}

interface TextObject {
  value?: string;
}

export async function GET(request: Request) {
  try {
    // Extract the threadId from the query parameters
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");

    if (!threadId) {
      return NextResponse.json(
        { error: "Thread ID is required" },
        { status: 400 }
      );
    }

    // Fetch messages for the specified threadId from OpenAI
    const messagesResponse = await openai.beta.threads.messages.list(threadId);
    const messages = messagesResponse.data;

    // Format the messages data into a simpler structure
    const formattedMessages = messages.map((msg: any) => {
      // Attempt to extract text from msg.content
      const messageText = msg.content
        .map((contentItem: ContentItem) => {
          // Check if the contentItem is an object with a 'text' property
          if (contentItem.type === "text" && contentItem.text) {
            // Extract the actual text
            if (typeof contentItem.text === "string") {
              return contentItem.text;
            } else if (Array.isArray(contentItem.text)) {
              // If it's an array, join the text elements together
              return contentItem.text
                .map((textObj: TextObject) => textObj.value || "")
                .join(" ");
            } else if (
              typeof contentItem.text === "object" &&
              contentItem.text.value
            ) {
              return contentItem.text.value;
            }
          }
          return ""; // Default to an empty string if no suitable value is found
        })
        .join(" ");

      return {
        message: messageText.trim(), // Use the extracted message text
        sender: msg.role === "user" ? "user" : "bot",
        createdAt: new Date(msg.created_at * 1000).toISOString(),
      };
    });

    // Return the formatted messages as JSON
    return NextResponse.json({ threadId, messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages from OpenAI:", error);
    return new Response("Error fetching messages from OpenAI", { status: 500 });
  }
}
