import { Hono } from "hono";
import { streamText } from "ai";
import { sendMessage } from "../services/chat.service";
import { prisma } from "../db";

export const chatController = new Hono();

chatController.post("/messages", async (c) => {
  const { conversationId, message } = await c.req.json();
  
  const reply = await sendMessage(conversationId, message);
  
  return c.json({ reply });
});

// Create a new conversation
chatController.post("/conversations", async (c) => {
  const conversation = await prisma.conversation.create({
    data: {},
  });
  return c.json(conversation);
});

// Get all conversations
chatController.get("/conversations", async (c) => {
  const conversations = await prisma.conversation.findMany({
    include: {
      _count: {
        select: { messages: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
  
  // Transform to include messageCount
  const formatted = conversations.map(conv => ({
    id: conv.id,
    createdAt: conv.createdAt,
    messageCount: conv._count.messages,
    lastMessage: conv.messages[0]?.content || null,
  }));
  
  return c.json(formatted);
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
