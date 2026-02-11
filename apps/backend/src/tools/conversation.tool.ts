import { prisma } from "../db";

export const getHistory = (conversationId: string) => {
  return prisma.message.findMany({ where: { conversationId } });
};
