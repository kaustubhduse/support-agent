import { runTogetherAgent } from "../lib/together_simple";
import { getHistory } from "../tools/conversation.tool";

export const supportAgent = async (
  message: string,
  conversationId: string
) => {
  // Get conversation history for context
  const history = await getHistory(conversationId);

  // Build context from previous messages
  const contextMessages = history.map((msg: any) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));

  try {
    // Generate AI response with context
    const { text } = await runTogetherAgent({
      system: `You are a helpful customer support agent. You assist customers with general inquiries, FAQs, troubleshooting, and product questions. Be friendly, professional, and concise. If you don't know something, admit it and offer to connect them with a specialist.`,
      messages: [
        ...contextMessages,
        {
          role: "user",
          content: message,
        },
      ],
    });

    return text;
  } catch (error) {
    console.error("[Support Agent] Error:", error);
    return "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment, or contact human support if the issue persists.";
  }
};
