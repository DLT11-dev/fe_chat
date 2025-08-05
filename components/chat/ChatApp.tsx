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
  const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);
  const [markedAsReadUsers, setMarkedAsReadUsers] = useState<Set<number>>(new Set());
  
  // Thêm ref để theo dõi việc đã load data chưa
  const hasLoadedData = useRef(false);

  const { user, isAuthenticated } = useAuthStore();
  const { socket, emit, on, isConnected } = useSocket();



  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await chatService.getRecentConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, []);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      const data = await chatService.getUsers(20); // Giới hạn 20 users
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
      // Reset markedAsReadUsers khi chọn user mới
      setMarkedAsReadUsers(new Set());
      loadMessages(user.id);
    },
    [loadMessages]
  );

  // Tự động đánh dấu tin nhắn đã đọc khi chọn user
  useEffect(() => {
    if (selectedUser && messages.length > 0 && !markedAsReadUsers.has(selectedUser.id)) {
      // Đánh dấu tất cả tin nhắn từ user này là đã đọc
      const markAllAsRead = async () => {
        try {
          await chatService.markAllMessagesAsRead(selectedUser.id);
          
          // Cập nhật trạng thái tin nhắn trong state
          setMessages((prev) => 
            prev.map(msg => 
              msg.senderId === selectedUser.id ? { ...msg, isRead: true } : msg
            )
          );
          
          // Đánh dấu user này đã được đánh dấu đã đọc
          setMarkedAsReadUsers(prev => new Set([...prev, selectedUser.id]));
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };
      
      markAllAsRead();
    }
  }, [selectedUser, messages.length, markedAsReadUsers]); // Bỏ loadConversations khỏi dependencies

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

  // Handle recall message
  const handleRecallMessage = useCallback(
    async (messageId: string) => {
      try {
        // Gửi sự kiện thu hồi qua WebSocket
        emit("recall_message", { messageId });
      } catch (error) {
        console.error("Error recalling message:", error);
      }
    },
    [emit]
  );

  // Socket event listeners
  useEffect(() => {
    if (!isConnected) return;

    // Listen for new messages
    const unsubscribeNewMessage = on("new_message", async (message: Message) => {
      setMessages((prev) => [...prev, message]);

      // Nếu tin nhắn từ người đang chat và đang ở trong cuộc trò chuyện với họ
      if (selectedUser && message.senderId === selectedUser.id) {
        try {
          // Đánh dấu tin nhắn đã đọc ngay lập tức
          await chatService.markMessageAsRead(message.id);
          
          // Cập nhật trạng thái tin nhắn trong state
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === message.id ? { ...msg, isRead: true } : msg
            )
          );
          

        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }
    });

    // Listen for sent messages
    const unsubscribeMessageSent = on("message_sent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for recalled messages
    const unsubscribeMessageRecalled = on("message_recalled", (data: { messageId: string }) => {
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === data.messageId ? { ...msg, isRecalled: true, recalledAt: new Date().toISOString() } : msg
        )
      );
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
      unsubscribeMessageRecalled();
      unsubscribeUserTyping();
      unsubscribeUserStoppedTyping();
      unsubscribeError();
    };
  }, [isConnected, on]); // Bỏ loadConversations khỏi dependencies

  // Load initial data - chỉ load một lần khi authenticated
  useEffect(() => {
    if (isAuthenticated && user && !hasInitialDataLoaded) {
      setHasInitialDataLoaded(true);
      
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
  }, [isAuthenticated, user, hasInitialDataLoaded]); // Bỏ loadConversations và loadUsers khỏi dependencies

  // Cập nhật conversations khi có thay đổi về tin nhắn đã đọc
  useEffect(() => {
    if (hasInitialDataLoaded && markedAsReadUsers.size > 0) {
      // Debounce để tránh gọi quá nhiều lần
      const timeoutId = setTimeout(() => {
        loadConversations();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [markedAsReadUsers, hasInitialDataLoaded]);

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
            onMessagesViewed={() => {
              // Đánh dấu tất cả tin nhắn đã đọc khi user xem hết tin nhắn
              if (selectedUser && messages.length > 0 && !markedAsReadUsers.has(selectedUser.id)) {
                const markAllAsRead = async () => {
                  try {
                    await chatService.markAllMessagesAsRead(selectedUser.id);
                    
                    // Cập nhật trạng thái tin nhắn trong state
                    setMessages((prev) => 
                      prev.map(msg => 
                        msg.senderId === selectedUser.id ? { ...msg, isRead: true } : msg
                      )
                    );
                    
                    // Đánh dấu user này đã được đánh dấu đã đọc
                    setMarkedAsReadUsers(prev => new Set([...prev, selectedUser.id]));
                  } catch (error) {
                    console.error("Error marking messages as read:", error);
                  }
                };
                
                markAllAsRead();
              }
            }}
            onRecallMessage={handleRecallMessage}
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
