import { describe, it, expect } from "vitest";
import {
  estimateTokenCount,
  calculateTotalTokens,
  truncateHistory,
  getContextStats,
  MAX_CONTEXT_TOKENS,
} from "./context.util";

describe("Context Utilities", () => {
  describe("estimateTokenCount", () => {
    it("should estimate tokens for empty string", () => {
      expect(estimateTokenCount("")).toBe(0);
    });

    it("should estimate tokens for short text", () => {
      const text = "Hello, world!"; 
      const tokens = estimateTokenCount(text);
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(text.length); 
    });

    it("should estimate tokens for long text", () => {
      const text = "A".repeat(1000);  
      const tokens = estimateTokenCount(text);
      expect(tokens).toBeCloseTo(250, 10); 
    });
  });

  describe("calculateTotalTokens", () => {
    it("should return 0 for empty array", () => {
      expect(calculateTotalTokens([])).toBe(0);
    });

    it("should sum tokens from multiple messages", () => {
      const messages = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
      ];
      const total = calculateTotalTokens(messages);
      expect(total).toBeGreaterThan(0);
    });
  });

  describe("truncateHistory", () => {
    it("should not truncate if under limit", () => {
      const messages = [
        { role: "system", content: "You are helpful" },
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello!" },
      ];
      const result = truncateHistory(messages, 10000);
      expect(result).toHaveLength(3);
    });

    it("should preserve system messages", () => {
      const messages = [
        { role: "system", content: "You are helpful" },
        { role: "user", content: "A".repeat(10000) }, 
        { role: "assistant", content: "B".repeat(10000) },
        { role: "user", content: "Recent message" },
      ];
      const result = truncateHistory(messages, 1000);
      
      expect(result.some((m) => m.role === "system" && m.content.includes("helpful"))).toBe(true);
    });

    it("should keep recent messages when truncating", () => {
      const messages = [
        { role: "user", content: "A".repeat(5000) },
        { role: "assistant", content: "B".repeat(5000) },
        { role: "user", content: "Recent" },
      ];
      const result = truncateHistory(messages, 500);
      
      expect(result.some((m) => m.content === "Recent")).toBe(true);
    });

    it("should add truncation indicator", () => {
      const messages = [
        { role: "user", content: "A".repeat(5000) },
        { role: "assistant", content: "B".repeat(5000) },
        { role: "user", content: "C".repeat(5000) },
        { role: "user", content: "Recent" },
      ];
      const result = truncateHistory(messages, 500);
      
      expect(
        result.some((m) => m.content.includes("truncated"))
      ).toBe(true);
    });
  });

  describe("getContextStats", () => {
    it("should return accurate stats", () => {
      const messages = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi!" },
      ];
      const stats = getContextStats(messages);
      
      expect(stats.totalMessages).toBe(2);
      expect(stats.totalTokens).toBeGreaterThan(0);
      expect(stats.maxTokens).toBe(MAX_CONTEXT_TOKENS);
      expect(stats.utilizationPercent).toBeGreaterThanOrEqual(0);
      expect(stats.remaining).toBeLessThanOrEqual(MAX_CONTEXT_TOKENS);
    });

    it("should calculate utilization percentage", () => {
      const messages = [
        { role: "user", content: "A".repeat(24000) }, 
      ];
      const stats = getContextStats(messages);
      
      expect(stats.utilizationPercent).toBeGreaterThan(90); 
    });
  });
});
