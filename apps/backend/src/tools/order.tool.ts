import { prisma } from "../db";

export const fetchOrder = (id: string) => {
  return prisma.order.findUnique({ where: { id } });
};
