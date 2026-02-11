import { prisma } from "../db";
import { runAgent } from "./agent.service";

export const sendMessage = async (
  conversationId: string,
  content: string
) => {
  try {
    if (!conversationId) {
      console.error("[Chat Service] Error: conversationId is missing");
      throw new Error("Conversation ID is required");
    }

    // 1. Save user message (and create conversation if needed)
    await prisma.message.create({
      data: {
        role: "user",
        content,
        conversation: {
          connectOrCreate: {
            where: { id: conversationId },
            create: { id: conversationId },
          },
        },
      },
    });

    // 2. Get AI response (or fallback)
    const reply = await runAgent(content, conversationId);

    // 3. Save assistant message
    await prisma.message.create({
      data: {
        conversationId,
        role: "assistant",
        content: reply,
      },
    });

    return reply;
  } catch (error) {
    console.error("[Chat Service] Error processing message:", error);
    return "I'm sorry, I encountered an internal error. Please try again.";
  }
};
