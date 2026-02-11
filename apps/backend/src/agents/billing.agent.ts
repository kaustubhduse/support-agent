import { runTogetherAgent } from "../lib/together_simple";
import { z } from "zod";
import { fetchInvoice, checkRefundStatus } from "../tools/billing.tool";

export const billingAgent = async (
  message: string,
  conversationId: string
) => {
  try {
    const { text } = await runTogetherAgent({
      system: `You are a billing and payment specialist. Help customers with invoices, payment issues, refunds, and subscription queries. Be professional and clear about financial matters.`,
      prompt: message,
      tools: {
        fetchInvoice: {
          description: "Fetch invoice details by invoice ID",
          parameters: z.object({
            invoiceId: z.string().describe("The invoice ID to look up"),
          }),
          execute: async ({ invoiceId }: any) => {
            const invoice = await fetchInvoice(invoiceId);
            return invoice || { error: "Invoice not found" };
          },
        },
        checkRefundStatus: {
          description: "Check refund status for an invoice by invoice ID",
          parameters: z.object({
            invoiceId: z.string().describe("The invoice ID to check refund status for"),
          }),
          execute: async ({ invoiceId }: any) => {
            const refund = await checkRefundStatus(invoiceId);
            return refund || { message: "No refund found for this invoice" };
          },
        },
      },
    });

    return text;
  } catch (error) {
    console.error("[Billing Agent] Error:", error);
    return "I'm currently running in offline mode due to API limits. I can't check invoice details right now, but normally I would help you with that!";
  }
};
