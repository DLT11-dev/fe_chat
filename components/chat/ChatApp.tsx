"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import AppHeader from "../AppHeader";
import { useSocket } from "@/common/hooks/useSocket";
import chatService from "@/common/modules/chat/chat.services";
import { Message, Conversation } from "@/common/modules/chat/chat.interface";
import { useAuthStore } from "@/common/stores/authStore";

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    username: string;
  } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [key: number]: string }>({});
  
  // Thêm ref để theo dõi việc đã load data chưa
  const hasLoadedData = useRef(false);

  const { user, isAuthenticated } = useAuthStore();
  const { socket, emit, on, isConnected } = useSocket();

  // Log để debug re-render
  console.log("🔄 ChatApp re-render - isAuthenticated:", isAuthenticated, "user:", user?.id, "hasLoadedData:", hasLoadedData.current);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      console.log("📞 Loading conversations...");
      const data = await chatService.getRecentConversations();
      console.log("📞 Conversations loaded:", data.length);
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, []);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      console.log("👥 Loading users...");
      const data = await chatService.getUsers();
      console.log("👥 Users loaded:", data.length);
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }, []);

  // Search users
  const searchUsers = useCallback(
    async (query: string) => {
      try {
        if (!query.trim()) {
          await loadUsers();
          return;
        }

        const data = await chatService.searchUsers(query, 20);
        setUsers(data);
      } catch (error) {
        console.error("Error searching users:", error);
        // Fallback to load all users if search fails
        await loadUsers();
      }
    },
    [loadUsers]
  );

  // Load messages for selected user
  const loadMessages = useCallback(
    async (otherUserId: number) => {
      if (!otherUserId) return;

      setLoading(true);
      try {
        const data = await chatService.getMessages(otherUserId);
        setMessages(data.reverse()); // Reverse để hiển thị tin nhắn cũ nhất trước

        // Mark messages as read
        await chatService.markAllMessagesAsRead(otherUserId);

        // Join conversation room
        emit("join_conversation", { otherUserId });
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [emit]
  );

  // Handle user selection
  const handleUserSelect = useCallback(
    (user: { id: number; username: string }) => {
      setSelectedUser(user);
      loadMessages(user.id);
    },
    [loadMessages]
  );

  // Handle send message
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedUser || !content.trim()) return;

      try {
        // Send via WebSocket for real-time
        emit("send_message", {
          content: content.trim(),
          receiverId: selectedUser.id,
          type: "text",
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [selectedUser, emit]
  );

  // Socket event listeners
  useEffect(() => {
    if (!isConnected) return;

    // Listen for new messages
    const unsubscribeNewMessage = on("new_message", (message: Message) => {
      console.log("📨 Received new message:", message);
      setMessages((prev) => [...prev, message]);

      // Update conversations list
      loadConversations();
    });

    // Listen for sent messages
    const unsubscribeMessageSent = on("message_sent", (message: Message) => {
      console.log("✅ Message sent confirmation:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing events
    const unsubscribeUserTyping = on(
      "user_typing",
      (data: { userId: number; username: string }) => {
        setTypingUsers((prev) => ({ ...prev, [data.userId]: data.username }));
      }
    );

    const unsubscribeUserStoppedTyping = on(
      "user_stopped_typing",
      (data: { userId: number; username: string }) => {
        setTypingUsers((prev) => {
          const newTypingUsers = { ...prev };
          delete newTypingUsers[data.userId];
          return newTypingUsers;
        });
      }
    );

    // Listen for errors
    const unsubscribeError = on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeMessageSent();
      unsubscribeUserTyping();
      unsubscribeUserStoppedTyping();
      unsubscribeError();
    };
  }, [isConnected, on, loadConversations]);

  // Load initial data - chỉ load một lần khi authenticated
  useEffect(() => {
    if (isAuthenticated && user && !hasLoadedData.current) {
      console.log("🚀 Loading initial data for the first time...");
      hasLoadedData.current = true;
      
      // Load data sequentially để tránh race condition
      const loadInitialData = async () => {
        try {
          await loadConversations();
          await loadUsers();
        } catch (error) {
          console.error("Error loading initial data:", error);
        }
      };
      
      loadInitialData();
    }
  }, [isAuthenticated, user]); // Bỏ loadConversations và loadUsers khỏi dependencies

  // Handle typing
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!selectedUser) return;

      if (isTyping) {
        emit("typing_start", { receiverId: selectedUser.id });
      } else {
        emit("typing_stop", { receiverId: selectedUser.id });
      }
    },
    [selectedUser, emit]
  );

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex flex-1">
        <Sidebar
          conversations={conversations}
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          onSearch={searchUsers}
        />
        <div className="flex flex-col flex-1">
          <ChatHeader selectedUser={selectedUser} isConnected={isConnected} />
          <MessageList
            messages={messages}
            currentUserId={user?.id ? Number(user.id) : undefined}
            loading={loading}
            typingUsers={typingUsers}
          />
          <MessageInput
            onSend={handleSendMessage}
            onTyping={handleTyping}
            disabled={!selectedUser}
          />
        </div>
      </div>
    </div>
  );
}
