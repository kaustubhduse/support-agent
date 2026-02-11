import { useState, useEffect, useRef } from "react";
import { sendMessage, getConversation } from "./api";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface ChatProps {
  conversationId: string;
  onNewConversation: () => void;
}

export default function Chat({ conversationId, onNewConversation }: ChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState("Thinking...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic thinking steps
  useEffect(() => {
    if (!isLoading) {
      setThinkingStep("Thinking...");
      return;
    }

    const steps = [
      "Analyzing request...",
      "Consulting knowledge base...",
      "Checking databases...",
      "Reasoning...",
      "Drafting response..."
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % steps.length;
      setThinkingStep(steps[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Load conversation history
  useEffect(() => {
    const loadMessages = async () => {
      if (conversationId) {
        const data = await getConversation(conversationId);
        setMessages(data);
      }
    };
    loadMessages();
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await sendMessage(conversationId, userMessage);

      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Support Chat</h1>
            <p className="text-purple-300 text-sm">Ask anything about orders, billing, or support</p>
          </div>
          <button
            onClick={onNewConversation}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all transform hover:scale-105"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-purple-300 mt-20">
            <h2 className="text-3xl font-bold mb-4">👋 Welcome!</h2>
            <p className="text-lg">How can I help you today?</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-white font-semibold">Track Orders</p>
                <p className="text-sm text-purple-300">Check order status</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-white font-semibold">Billing Help</p>
                <p className="text-sm text-purple-300">Invoice & payments</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-white font-semibold">General Support</p>
                <p className="text-sm text-purple-300">FAQs & help</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-white border border-purple-500/20"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-purple-500/20 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                <span className="text-purple-300 text-sm ml-2 min-w-[120px] transition-all duration-300 fade-in">
                  {thinkingStep}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-purple-500/20 px-6 py-4">
        <div className="flex items-end space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-slate-900 text-white border border-purple-500/30 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-purple-500 placeholder-purple-300/50"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-all transform hover:scale-105 disabled:transform-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
