import { prisma } from "../db";

export const fetchInvoice = (id: string) => {
  return prisma.invoice.findUnique({ where: { id } });
};

export const checkRefundStatus = (invoiceId: string) => {
  return prisma.refund.findFirst({ 
    where: { invoiceId },
    orderBy: { createdAt: 'desc' } // Get most recent refund
  });
};

export const updateRefundStatus = async (invoiceId: string, newStatus: string) => {
  return prisma.refund.updateMany({
    where: { invoiceId },
    data: { 
      status: newStatus,
      processedAt: newStatus === "Completed" ? new Date() : null
    }
  });
};
