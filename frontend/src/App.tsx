import { useState, useEffect } from "react";
import Chat from "./Chat";
import { createConversation, getConversations, deleteConversation } from "./api";

interface Conversation {
  id: string;
  createdAt: string;
  messageCount: number;
}

export default function App() {
  const [conversationId, setConversationId] = useState("conv1");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const convos = await getConversations();
    setConversations(convos);
  };

  const handleNewConversation = async () => {
    // Prevent multiple simultaneous creations
    if (isCreatingConversation) return;
    
    setIsCreatingConversation(true);
    try {
      // Create new conversation in database
      const newId = await createConversation();
      
      // Switch to the new conversation
      setConversationId(newId);
      
      // Refresh sidebar to show new conversation
      await loadConversations();
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setConversationId(id);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
    await loadConversations();
    // If deleted current conversation, create new one
    if (id === conversationId) {
      handleNewConversation();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar - Overlay on mobile, fixed on desktop */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 z-30 w-64 h-full bg-gray-950 border-r border-gray-800 transition-transform duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={handleNewConversation}
            disabled={isCreatingConversation}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm md:text-base"
          >
            {isCreatingConversation ? "Creating..." : "+ New Chat"}
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  conv.id === conversationId
                    ? "bg-gray-800"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      Conversation {conv.id.slice(0, 8)}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {conv.messageCount} messages
                    </p>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-400 transition-opacity"
                    title="Delete conversation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Mobile Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <Chat
          conversationId={conversationId}
          onNewConversation={handleNewConversation}
        />
      </div>

      {/* Toggle Sidebar Button - Responsive positioning */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-r-lg transition-all duration-300 shadow-xl border-r border-t border-b border-gray-700 ${
          sidebarOpen ? "left-64 md:left-64" : "left-0"
        }`}
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>
    </div>
  );
}
