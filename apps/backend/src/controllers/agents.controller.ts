import { Hono } from "hono";

export const agentsController = new Hono();

agentsController.get("/", async (c) => {
  const agents = [
    {
      type: "router",
      name: "Router Agent",
      description: "Analyzes incoming queries and routes to specialized agents",
    },
    {
      type: "support",
      name: "Support Agent",
      description: "Handles general support inquiries, FAQs, and troubleshooting",
      capabilities: ["FAQ", "Troubleshooting", "Product Information"],
    },
    {
      type: "order",
      name: "Order Agent",
      description: "Handles order status, tracking, modifications, and cancellations",
      capabilities: ["Order Status", "Tracking", "Order Modifications"],
    },
    {
      type: "billing",
      name: "Billing Agent",
      description: "Handles payment issues, refunds, invoices, and subscriptions",
      capabilities: ["Invoice Lookup", "Payment Status", "Refund Requests"],
    },
  ];

  return c.json({ agents });
});

// Get agent capabilities
agentsController.get("/:type/capabilities", async (c) => {
  const type = c.req.param("type");

  const capabilities: Record<string, any> = {
    support: {
      tools: ["getConversationHistory"],
      description: "Provides context-aware support using conversation history",
    },
    order: {
      tools: ["fetchOrder"],
      description: "Retrieves order information and tracking details",
    },
    billing: {
      tools: ["fetchInvoice"],
      description: "Retrieves invoice and payment information",
    },
  };

  if (!capabilities[type]) {
    return c.json({ error: "Agent type not found" }, 404);
  }

  return c.json(capabilities[type]);
});
