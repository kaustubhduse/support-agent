import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env file");
  process.exit(1);
}

console.log("DATABASE_URL is:", process.env.DATABASE_URL ? "SET" : "NOT SET");

const prisma = new PrismaClient({});

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.order.deleteMany();
  await prisma.invoice.deleteMany();

  // Seed orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        id: "ORD123",
        status: "Shipped",
        tracking: "TRK999888",
      },
    }),
    prisma.order.create({
      data: {
        id: "ORD124",
        status: "Processing",
        tracking: "TRK999889",
      },
    }),
    prisma.order.create({
      data: {
        id: "ORD125",
        status: "Delivered",
        tracking: "TRK999890",
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders`);

  // Seed invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        id: "INV123",
        amount: 499.99,
        status: "Paid",
      },
    }),
    prisma.invoice.create({
      data: {
        id: "INV124",
        amount: 299.99,
        status: "Pending",
      },
    }),
    prisma.invoice.create({
      data: {
        id: "INV125",
        amount: 599.99,
        status: "Overdue",
      },
    }),
  ]);

  console.log(`✅ Created ${invoices.length} invoices`);

  // Seed Refunds
  const refunds = await Promise.all([
    prisma.refund.create({
      data: {
        id: "REF123",
        invoiceId: "INV123",
        amount: 499.99,
        status: "completed",
        reason: "Product defect",
        processedAt: new Date("2024-01-20"),
      },
    }),
    prisma.refund.create({
      data: {
        id: "REF124",
        invoiceId: "INV124",
        amount: 299.99,
        status: "pending",
        reason: "Customer request",
      },
    }),
    prisma.refund.create({
      data: {
        id: "REF125",
        invoiceId: "INV125",
        amount: 599.99,
        status: "approved",
        reason: "Billing error",
      },
    }),
  ]);

  console.log(`✅ Created ${refunds.length} refunds`);

  // Seed sample conversation
  const conversation = await prisma.conversation.create({
    data: {
      id: "conv1",
      messages: {
        create: [
          {
            role: "user",
            content: "Hello, I need help with my order",
          },
          {
            role: "assistant",
            content:
              "Hi! I'd be happy to help you with your order. Could you please provide your order ID?",
          },
        ],
      },
    },
  });

  console.log(`✅ Created sample conversation with ${conversation.id}`);

  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
