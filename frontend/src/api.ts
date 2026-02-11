const API_BASE = "http://localhost:3000/api";

export const sendMessage = async (
  conversationId: string,
  message: string
) => {
  const res = await fetch(`${API_BASE}/chat/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId,
      message,
    }),
  });

  return res.json();
};

export const getConversations = async () => {
  const res = await fetch(`${API_BASE}/chat/conversations`);
  return res.json();
};

export const getConversation = async (id: string) => {
  const res = await fetch(`${API_BASE}/chat/conversations/${id}`);
  return res.json();
};

export const deleteConversation = async (id: string) => {
  const res = await fetch(`${API_BASE}/chat/conversations/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const createConversation = async () => {
  // Generate a unique conversation ID
  return `conv_${Date.now()}`;
};
