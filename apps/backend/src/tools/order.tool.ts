import { prisma } from "../db";

export const fetchOrder = (id: string) => {
  return prisma.order.findUnique({ where: { id } });
};

export const cancelOrder = async (id: string) => {
  return prisma.order.update({
    where: { id },
    data: { status: "Cancelled" }
  });
};
