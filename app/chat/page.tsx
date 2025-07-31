'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ChatApp from '@/components/chat/ChatApp';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatApp />
    </ProtectedRoute>
  );
}