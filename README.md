# AI Customer Support System

A fullstack AI-powered customer support system with multi-agent architecture, featuring intelligent routing, database-backed tools, and conversational context management.

## Architecture

### Multi-Agent System
- **Router Agent**: Analyzes incoming queries and delegates to specialized sub-agents
- **Support Agent**: Handles general inquiries, FAQs, and troubleshooting with conversation history
- **Order Agent**: Manages order status, tracking, and delivery queries
- **Billing Agent**: Handles invoices, payments, and refund status checks

### Controller-Service Pattern
Clean separation of concerns with dedicated controllers, services, and middleware for error handling and rate limiting.

## Tech Stack

**Backend**
- Hono.dev (Web framework)
- Prisma ORM
- PostgreSQL (Neon)
- Together AI (Custom runner implementation)
- TypeScript

**Frontend**
- React + Vite
- TailwindCSS
- TypeScript

## Features

### Core Requirements
- Multi-agent routing with intelligent classification
- Database-backed tools (fetchOrder, fetchInvoice, checkRefundStatus, getHistory)
- Conversational context across messages
- RESTful API with streaming support
- Message and conversation persistence
- Real-time typing indicators

### Bonus Features
- Rate limiting (60 requests/minute)
- Context management with token truncation
- Unit tests (Vitest)
- Integration tests (Supertest)
- ChatGPT-style UI with conversation sidebar
- Deployment documentation

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Together AI API key

### Environment Variables

Create `.env` in `apps/backend`:

```env
DATABASE_URL="postgresql://..."
TOGETHER_API_KEY="your-together-ai-key"
PORT=3000
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
cd apps/backend
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npm run db:seed

# Start backend
npm run dev

# Start frontend (in new terminal)
cd ../../frontend
npm run dev
```

## API Routes

```
/api/chat
  POST   /messages              # Send new message
  GET    /conversations         # List all conversations
  POST   /conversations         # Create new conversation
  GET    /conversations/:id     # Get conversation messages
  DELETE /conversations/:id     # Delete conversation

/api/agents
  GET    /agents                # List available agents
  GET    /agents/:type/capabilities  # Get agent capabilities

/api/health                     # Health check
```

## Database Schema

**Conversation** - Stores chat sessions  
**Message** - User and AI messages  
**Order** - Sample order data (id, status, tracking)  
**Invoice** - Invoice records (id, amount, status)  
**Refund** - Refund tracking (invoiceId, amount, status, reason)

## Testing

### Unit Tests
```bash
cd apps/backend
npm test
```

### Integration Tests
```bash
npm run test:run
```

### Demo Test Script

Use these queries to test all features:

**Multi-Agent Routing:**
1. "Hi, I need help" → Support Agent
2. "Where is my order ORD123?" → Order Agent (uses fetchOrder tool)
3. "Show me invoice INV124" → Billing Agent (uses fetchInvoice tool)

**Tool Usage & Database:**
4. "What's the status of order ORD124?" → Fetches real data (Processing, TRK888777)
5. "Check refund status for invoice INV125" → Uses checkRefundStatus ($599.99, Approved)
6. "Tell me about invoice INV123" → Shows invoice details

**Conversational Context:**
7. "What was the first thing I asked?" → Support agent references conversation history
8. "And the second question?" → Shows context awareness

**UI Features:**
- Click "+ New Chat" to create new conversation
- Switch between conversations in sidebar
- Toggle sidebar visibility
- Delete conversations

## Seeded Test Data

**Orders:**
- ORD123: Shipped, TRK999888
- ORD124: Processing, TRK888777
- ORD125: Delivered, TRK777666

**Invoices:**
- INV123: $499.99, Paid
- INV124: $299.99, Pending
- INV125: $599.99, Overdue

**Refunds:**
- REF123: INV123, $499.99, Completed
- REF124: INV124, $299.99, Pending
- REF125: INV125, $599.99, Approved

## Project Structure

```
ai-support-system/
├── apps/
│   └── backend/
│       ├── prisma/           # Database schema and migrations
│       ├── src/
│       │   ├── agents/       # AI agents (router, support, order, billing)
│       │   ├── controllers/  # Route handlers
│       │   ├── services/     # Business logic
│       │   ├── tools/        # Agent tools (database queries)
│       │   ├── lib/          # Together AI integration
│       │   ├── utils/        # Context management utilities
│       │   └── middleware/   # Error handling, rate limiting
│       └── __tests__/        # Integration tests
└── frontend/
    └── src/
        ├── App.tsx           # Main app with sidebar
        ├── Chat.tsx          # Chat interface
        └── api.ts            # API client

```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for Vercel and Railway.

## Implementation Notes

- Custom Together AI runner built to replace failing Vercel AI SDK integration
- Context truncation maintains last 6000 tokens to prevent API errors
- Rate limiting prevents API abuse (60 RPM per IP)
- All conversations and messages persist in PostgreSQL
- Tools query actual database records via Prisma

## License

MIT
