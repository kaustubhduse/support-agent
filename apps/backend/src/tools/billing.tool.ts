import { prisma } from "../db";

export const fetchInvoice = (id: string) => {
  return prisma.invoice.findUnique({ where: { id } });
};
