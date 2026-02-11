import { runTogetherAgent } from "../lib/together_simple";
import { z } from "zod";
import { fetchOrder } from "../tools/order.tool";

export const orderAgent = async (message: string, conversationId: string) => {
  try {
    const { text } = await runTogetherAgent({
      system: `You are an order management specialist. Help customers with order status, tracking information, modifications, and cancellations. Be clear and informative about order details.`,
      prompt: message, // Or messages if we want history? Router passes just message. 
      // Ideally we should fetch history here too? 
      // The router architecture implies stateless agents or agents that fetch their own context.
      // The original code used `prompt: message`. So we stick to that for now.
      tools: {
        fetchOrder: {
          description: "Fetch order details by order ID",
          parameters: z.object({
            orderId: z.string().describe("The order ID to look up"),
          }),
          execute: async ({ orderId }: any) => {
            const order = await fetchOrder(orderId);
            return order || { error: "Order not found" };
          },
        },
      },
    });

    return text;
  } catch (error) {
    console.error("[Order Agent] Error:", error);
    return "I'm currently running in offline mode due to API limits. I can't look up live orders right now, but normally I would help you with that!";
  }
};
