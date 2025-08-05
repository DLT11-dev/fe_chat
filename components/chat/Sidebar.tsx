'use client';

import { Search, Users, MessageCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Conversation } from '@/common/modules/chat/chat.interface';
import UsersTab from './UsersTab';

interface SidebarProps {
  conversations: Conversation[];
  users: any[];
  selectedUser: { id: number; username: string } | null;
  onUserSelect: (user: { id: number; username: string }) => void;
  onSearch: (query: string) => Promise<void>;
}

export default function Sidebar({ conversations, users, selectedUser, onUserSelect, onSearch }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'users'>('conversations');
  const [isSearching, setIsSearching] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sử dụng API tìm kiếm khi có searchTerm
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          await onSearch(searchTerm);
        } finally {
          setIsSearching(false);
        }
      } else {
        await onSearch('');
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  // Tự động chuyển sang tab users khi tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() && activeTab === 'conversations') {
      setActiveTab('users');
    }
  }, [searchTerm, activeTab]);

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người dùng... (Ctrl+K)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchTerm('');
              e.currentTarget.blur();
            }
          }}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        {searchTerm && !isSearching && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeTab === 'conversations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Cuộc trò chuyện ({conversations.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Người dùng ({users.length}/20)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'conversations' ? (
        <ul className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <li
                key={conversation.otherUserId}
                onClick={() => onUserSelect(conversation.user)}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${
                  selectedUser?.id === conversation.user.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {conversation.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{conversation.user.username}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.lastMessageTime).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500 py-4">Không có cuộc trò chuyện nào</li>
          )}
        </ul>
      ) : (
        <UsersTab
          users={users}
          selectedUser={selectedUser}
          conversations={conversations}
          onUserSelect={onUserSelect}
          searchTerm={searchTerm}
          isSearching={isSearching}
        />
      )}
    </aside>
  );
}