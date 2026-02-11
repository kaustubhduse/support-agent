import { Context, Next } from "hono";

export const errorMiddleware = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    console.error("Global Error:", err);

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500
    );
  }
};
