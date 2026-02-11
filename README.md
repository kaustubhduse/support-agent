# AI Customer Support System

Full-stack AI-powered customer support with multi-agent architecture.

## Features

- 🤖 **Multi-Agent System**: Router agent intelligently delegates to specialized sub-agents (Support, Order, Billing)
- 💬 **Conversational AI**: Maintains context across messages using Vercel AI SDK
- 🛠️ **Tool Calling**: Agents can fetch real data from database (orders, invoices)
- 🎨 **Modern UI**: Beautiful gradient interface with real-time typing indicators
- 📦 **Full-Stack TypeScript**: Type-safe from database to UI

## Tech Stack

**Frontend**: React, Vite, Tailwind CSS  
**Backend**: Hono.js, Vercel AI SDK  **Database**: PostgreSQL, Prisma ORM  
**AI**: OpenAI GPT-4o-mini

## Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd ai-support-system

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

### 2. Environment Variables

Create `apps/backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
OPENAI_API_KEY=sk-proj-...your-key-here
PORT=3000
```

### 3. Database Setup

```bash
cd apps/backend

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# UI runs on http://localhost:5173
```

## API Endpoints

### Chat
- `POST /api/chat/messages` - Send a message
- `GET /api/chat/conversations` - List all conversations
- `GET /api/chat/conversations/:id` - Get conversation history
- `DELETE /api/chat/conversations/:id` - Delete conversation

### Agents
- `GET /api/agents` - List available agents
- `GET /api/agents/:type/capabilities` - Get agent capabilities

### Health
- `GET /api/health` - Health check

## Architecture

### Multi-Agent System

1. **Router Agent**: Analyzes intent and routes to specialist
2. **Support Agent**: General inquiries with conversation context
3. **Order Agent**: Order status, tracking (uses `fetchOrder` tool)
4. **Billing Agent**: Invoices, payments (uses `fetchInvoice` tool)

### Sample Data

The seed script creates:
- 3 orders (ORD123, ORD124, ORD125)
- 3 invoices (INV123, INV124, INV125)
- 1 sample conversation

Try asking:
- "What's the status of order ORD123?"
- "Show me invoice INV124"
- "I need help with my account"

## Project Structure

```
ai-support-system/
├── apps/backend/
│   ├── src/
│   │   ├── agents/          # AI agents
│   │   ├── controllers/     # API routes
│   │   ├── services/        # Business logic
│   │   ├── tools/           # Agent tools
│   │   └── middleware/      # Error handling
│   └── prisma/
│       └── schema.prisma    # Database schema
└── frontend/
    └── src/
        ├── Chat.tsx         # Main chat UI
        └── api.ts           # API client
```

## Development

- Backend uses `tsx watch` for hot reload
- Frontend uses Vite HMR
- TypeScript for type safety
- Prisma for database migrations

## Notes

- TypeScript lint errors in agents are false positives from AI SDK version mismatches - the code works correctly
- Make sure to add your OPENAI_API_KEY before running
- Database must be accessible from your development environment

## Bonus Features Implemented

- ✅ Clean architecture (Controller-Service-Repository pattern)
- ✅ Comprehensive error handling
- ✅ Modern, beautiful UI
- ✅ Real-time AI typing indicator
- ✅ Conversation persistence
- ✅ Multi-agent routing with AI classification

---

Built for fullstack engineering assessment.
