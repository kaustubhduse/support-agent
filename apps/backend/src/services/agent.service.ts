import { routerAgent } from "../agents/router.agent";

/**
 * Agent Service
 * Responsible for delegating messages to router agent
 */
export const runAgent = async (
  message: string,
  conversationId: string
) => {
  try {
    console.log(`[Agent Service] Processing message for conversation ${conversationId}: ${message}`);
    const response = await routerAgent(message, conversationId);
    console.log(`[Agent Service] Agent response: ${response}`);
    return response;
  } catch (error) {
    console.error("[Agent Service] Error:", error);
    if (error instanceof Error) {
      console.error("[Agent Service] Stack:", error.stack);
    }
    return "Something went wrong while processing your request. Please try again later.";
  }
};
