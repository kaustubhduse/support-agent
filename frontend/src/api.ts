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

export async function getConversation(conversationId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/chat/conversations/${conversationId}`);
  const data = await res.json();
  // Backend returns array of messages directly, not wrapped in object
  return Array.isArray(data) ? data : [];
}

export async function getConversations(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/chat/conversations`);
  return await res.json();
}

export async function deleteConversation(conversationId: string): Promise<void> {
  await fetch(`${API_BASE}/chat/conversations/${conversationId}`, {
    method: "DELETE",
  });
}

export async function createConversation(): Promise<string> {
  const res = await fetch(`${API_BASE}/chat/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const conversation = await res.json();
  return conversation.id;
}
