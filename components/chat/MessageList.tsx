'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/common/modules/chat/chat.interface';

interface MessageListProps {
  messages: Message[];
  currentUserId?: number;
  loading: boolean;
  typingUsers: { [key: number]: string };
  onMessagesViewed?: () => void;
  onRecallMessage?: (messageId: string) => void;
}

export default function MessageList({ messages, currentUserId, loading, typingUsers, onMessagesViewed, onRecallMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Tự động đánh dấu tin nhắn đã đọc khi có tin nhắn mới và user đang ở cuối
  useEffect(() => {
    if (messages.length > 0 && onMessagesViewed) {
      const container = containerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        // Nếu user đang ở cuối danh sách tin nhắn, đánh dấu đã đọc
        if (scrollHeight - scrollTop - clientHeight < 50) {
          onMessagesViewed();
        }
      }
    }
  }, [messages, onMessagesViewed]);

  // Kiểm tra xem user có đang ở cuối danh sách tin nhắn không
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onMessagesViewed) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Nếu scroll đến gần cuối (cách cuối 50px), coi như đã xem hết tin nhắn
      if (scrollHeight - scrollTop - clientHeight < 50) {
        // Debounce để tránh gọi quá nhiều lần
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onMessagesViewed();
        }, 300);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [onMessagesViewed]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Đang tải tin nhắn...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-2 messages-container">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p>Chưa có tin nhắn nào</p>
            <p className="text-sm">Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên!</p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.senderId === currentUserId;
          const canRecall = isOwnMessage && !message.isRead && !message.isRecalled;
          const timeSinceCreated = Date.now() - new Date(message.createdAt).getTime();
          const canRecallTime = timeSinceCreated < 5 * 60 * 1000; // 5 phút
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs message-animation relative group ${
                  isOwnMessage 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.isRecalled ? (
                  <div className="text-center">
                    <p className="text-xs italic opacity-70">
                      Tin nhắn đã được thu hồi
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {isOwnMessage && (
                        <span className="ml-2">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                    
                    {/* Nút thu hồi tin nhắn */}
                    {canRecall && canRecallTime && (
                      <button
                        onClick={() => onRecallMessage?.(message.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        title="Thu hồi tin nhắn"
                      >
                        ×
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
      
      {/* Typing indicator */}
      {Object.keys(typingUsers).length > 0 && (
        <div className="flex justify-start">
          <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs ml-2">
                {Object.values(typingUsers).join(', ')} đang gõ...
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}