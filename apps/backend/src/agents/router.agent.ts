import { runTogetherAgent } from "../lib/together_simple";
import { orderAgent } from "./order.agent";
import { billingAgent } from "./billing.agent";
import { supportAgent } from "./support.agent";

export const routerAgent = async (
  message: string,
  conversationId: string
) => {
  let intent = "support";
  
  try{
    const { text } = await runTogetherAgent({
      system: `You are a router agent for a customer support system. Analyze this user message and determine which specialized agent should handle it.
      
      User message: "${message}"
      
      Available agents:
      - support: For general inquiries, FAQs, troubleshooting, product questions
      - order: For order status, tracking, modifications, cancellations
      - billing: For payment issues, refunds, invoices, subscription queries
      
      Respond with ONLY the agent name (support, order, or billing). Do not add any other text.`,
      prompt: message,
    });
    
    if (text) {
        intent = text.trim().toLowerCase();
        intent = intent.replace(/[^a-z]/g, "");
    }
    
    console.log(`[Router Agent] Classification: ${intent}`);
  } 
  catch(error){
    console.error("[Router Agent] Classification failed, defaulting to support:", error);
    intent = "support";
  }
  
  if(intent.includes("order")){
    return orderAgent(message, conversationId);
  }
  
  if(intent.includes("billing")){
    return billingAgent(message, conversationId);
  }
  
  return supportAgent(message, conversationId);
};
