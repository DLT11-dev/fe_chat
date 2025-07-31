'use client';

import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Conversation } from '@/common/modules/chat/chat.interface';

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

  const filteredUsers = users;

  // Tự động chuyển sang tab users khi tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() && activeTab === 'conversations') {
      setActiveTab('users');
    }
  }, [searchTerm, activeTab]);

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-4 flex flex-col">
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
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'conversations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cuộc trò chuyện ({conversations.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Người dùng ({users.length})
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {activeTab === 'conversations' ? (
          filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <li
                key={conversation.otherUserId}
                onClick={() => onUserSelect(conversation.user)}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
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
          )
        ) : (
          <>
            {searchTerm && (
              <div className="mb-2 px-3 py-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">
                  Kết quả tìm kiếm username cho "{searchTerm}"
                </p>
              </div>
            )}
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                const isInConversation = conversations.some(conv => conv.user.id === user.id);
                
                return (
                  <li
                    key={user.id}
                    onClick={() => onUserSelect(user)}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        isInConversation ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                                             <div className="flex-1 min-w-0">
                         <div className="flex items-center space-x-2">
                           <p className="text-sm font-medium truncate">{user.username}</p>
                           {isInConversation && (
                             <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                               Đã chat
                             </span>
                           )}
                         </div>
                         {user.email && (
                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
                         )}
                       </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {isSelected && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </li>
                );
              })
            ) : searchTerm ? (
              <li className="text-center text-gray-500 py-4">
                <p>Không tìm thấy người dùng nào</p>
                <p className="text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
              </li>
            ) : (
              <li className="text-center text-gray-500 py-4">
                <p>Không có người dùng nào</p>
                <p className="text-xs mt-1">Hãy đăng ký thêm tài khoản để test</p>
              </li>
            )}
          </>
        )}
      </ul>
    </aside>
  );
}