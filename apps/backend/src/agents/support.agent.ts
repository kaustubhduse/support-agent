import { runTogetherAgent } from "../lib/together_simple";
import { getHistory } from "../tools/conversation.tool";
import { truncateHistory, getContextStats } from "../utils/context.util";

export const supportAgent = async (
  message: string,
  conversationId: string
) => {
  const history = await getHistory(conversationId);

  const contextMessages = history.map((msg: any) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));
  const truncatedMessages = truncateHistory(contextMessages);
  
  const stats = getContextStats(truncatedMessages);
  console.log(`[Support Agent] Context: ${stats.totalMessages} msgs, ${stats.totalTokens} tokens (${stats.utilizationPercent}% used)`);

  try{
    const { text } = await runTogetherAgent({
      system: `You are a helpful customer support agent. You assist customers with general inquiries, FAQs, troubleshooting, and product questions. Be friendly, professional, and concise. If you don't know something, admit it and offer to connect them with a specialist.`,
      messages: [
        ...truncatedMessages,
        {
          role: "user",
          content: message,
        },
      ],
    });

    return text;
  } 
  catch(error){
    console.error("[Support Agent] Error:", error);
    return "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment, or contact human support if the issue persists.";
  }
};
