import { useState } from "react";
import Chat from "./Chat";
import { createConversation } from "./api";

export default function App() {
  const [conversationId, setConversationId] = useState("conv1");

  const handleNewConversation = async () => {
    const newId = await createConversation();
    setConversationId(newId);
  };

  return (
    <Chat
      conversationId={conversationId}
      onNewConversation={handleNewConversation}
    />
  );
}
