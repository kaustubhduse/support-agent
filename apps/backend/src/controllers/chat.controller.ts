import { Hono } from "hono";
import { streamText } from "ai";
import { sendMessage } from "../services/chat.service";
import { prisma } from "../db";

export const chatController = new Hono();

// Send a message and get AI response (streaming)
chatController.post("/messages", async (c) => {
  const { conversationId, message } = await c.req.json();
  
  // Save user message and get AI response
  const reply = await sendMessage(conversationId, message);
  
  return c.json({ reply });
});

// Get all conversations
chatController.get("/conversations", async (c) => {
  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return c.json(conversations);
});

// Get conversation by ID
chatController.get("/conversations/:id", async (c) => {
  const id = c.req.param("id");
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });
  return c.json(messages);
});

// Delete conversation
chatController.delete("/conversations/:id", async (c) => {
  const id = c.req.param("id");
  
  // Delete messages first (cascade)
  await prisma.message.deleteMany({
    where: { conversationId: id },
  });
  
  // Delete conversation
  await prisma.conversation.delete({
    where: { id },
  });
  
  return c.json({ success: true });
});
