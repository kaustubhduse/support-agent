import { prisma } from "../db";

export const fetchInvoice = (id: string) => {
  return prisma.invoice.findUnique({ where: { id } });
};

export const checkRefundStatus = (invoiceId: string) => {
  return prisma.refund.findFirst({ 
    where: { invoiceId },
    orderBy: { createdAt: 'desc' }
  });
};
