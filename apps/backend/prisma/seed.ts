import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is set
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Xj3DluAoR5LY@ep-muddy-mode-aic3p512-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

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
