/**
 * Context management utilities for handling conversation history
 * and preventing token limit errors
 */

export const MAX_CONTEXT_TOKENS = 6000; // Leave ~2000 tokens for response
export const TOKENS_PER_CHAR = 0.25; // Rough estimate: 1 token ≈ 4 chars

interface Message {
  role: string;
  content: string;
}

/**
 * Estimate token count for a text string
 * Uses rough approximation: 1 token ≈ 4 characters
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length * TOKENS_PER_CHAR);
}

/**
 * Calculate total tokens in message array
 */
export function calculateTotalTokens(messages: Message[]): number {
  return messages.reduce((total, msg) => {
    return total + estimateTokenCount(msg.content);
  }, 0);
}

/**
 * Truncate conversation history to fit within token limit
 * Preserves recent messages and system prompts
 * @param messages Full conversation history
 * @param maxTokens Maximum allowed tokens (default: MAX_CONTEXT_TOKENS)
 * @returns Truncated message array
 */
export function truncateHistory(
  messages: Message[],
  maxTokens: number = MAX_CONTEXT_TOKENS
): Message[] {
  // If already under limit, return as-is
  if (calculateTotalTokens(messages) <= maxTokens) {
    return messages;
  }

  // Always preserve system messages
  const systemMessages = messages.filter(m => m.role === "system");
  const nonSystemMessages = messages.filter(m => m.role !== "system");

  // Start with system messages
  let truncated = [...systemMessages];
  let currentTokens = calculateTotalTokens(truncated);

  // Add messages from the end (most recent) until we hit the limit
  for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
    const msg = nonSystemMessages[i];
    const msgTokens = estimateTokenCount(msg.content);

    if (currentTokens + msgTokens > maxTokens) {
      // Add truncation indicator
      if (i > 0) {
        truncated.push({
          role: "system",
          content: "[Earlier conversation history truncated to save tokens]"
        });
      }
      break;
    }

    truncated.splice(systemMessages.length, 0, msg); // Insert after system messages
    currentTokens += msgTokens;
  }

  return truncated;
}

/**
 * Get context window stats for debugging
 */
export function getContextStats(messages: Message[]) {
  const totalTokens = calculateTotalTokens(messages);
  const utilization = (totalTokens / MAX_CONTEXT_TOKENS) * 100;

  return {
    totalMessages: messages.length,
    totalTokens,
    maxTokens: MAX_CONTEXT_TOKENS,
    utilizationPercent: Math.round(utilization),
    remaining: MAX_CONTEXT_TOKENS - totalTokens,
  };
}
