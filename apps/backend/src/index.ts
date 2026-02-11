import { Hono } from "hono";
import { cors } from "hono/cors";
import { chatController } from "./controllers/chat.controller";
import { agentsController } from "./controllers/agents.controller";
import { errorMiddleware } from "./middleware/error.middleware";

const app = new Hono();

app.use("*", cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("*", errorMiddleware);

// Rate limiting (100 req/15min)
import { rateLimiter } from "hono-rate-limiter";
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, 
  limit: 100,
  keyGenerator: (c) => c.req.header("x-forwarded-for") || "ip",
});
app.use("/api/*", limiter);

app.route("/api/chat", chatController);
app.route("/api/agents", agentsController);

app.get("/api/health", (c) => c.text("OK"));

export default app;
