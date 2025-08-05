'use client';

import React from 'react';
import { Users, UserCheck, UserPlus, Search } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email?: string;
}

interface UsersTabProps {
  users: User[];
  selectedUser: { id: number; username: string } | null;
  conversations: any[];
  onUserSelect: (user: { id: number; username: string }) => void;
  searchTerm: string;
  isSearching: boolean;
}

export default function UsersTab({ 
  users, 
  selectedUser, 
  conversations, 
  onUserSelect, 
  searchTerm, 
  isSearching 
}: UsersTabProps) {
  const getUsersWithStatus = () => {
    return users.map(user => {
      const isInConversation = conversations.some(conv => conv.user.id === user.id);
      const isSelected = selectedUser?.id === user.id;
      
      return {
        ...user,
        isInConversation,
        isSelected
      };
    });
  };

  const usersWithStatus = getUsersWithStatus();
  const hasUsers = usersWithStatus.length > 0;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header với thông tin */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Danh sách người dùng
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {users.length}/20
          </span>
        </div>
        
        {!searchTerm && (
          <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 font-medium">
              Hiển thị tối đa 20 người dùng
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Không bao gồm tài khoản đang đăng nhập
            </p>
          </div>
        )}
      </div>

      {/* Kết quả tìm kiếm */}
      {searchTerm && (
        <div className="mb-3 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-100">
          <div className="flex items-center">
            <Search className="w-4 h-4 text-yellow-600 mr-2" />
            <p className="text-xs text-yellow-700 font-medium">
              Kết quả tìm kiếm cho "{searchTerm}"
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isSearching && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-500">Đang tìm kiếm...</span>
          </div>
        </div>
      )}

      {/* Danh sách users */}
      {!isSearching && (
        <>
          {hasUsers ? (
            <div className="space-y-1">
              {usersWithStatus.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onUserSelect(user)}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 ${
                    user.isSelected 
                      ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                      : 'border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                      user.isInConversation ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{user.username}</p>
                        {user.isInConversation && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Đã chat
                          </span>
                        )}
                        {!user.isInConversation && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full flex items-center">
                            <UserPlus className="w-3 h-3 mr-1" />
                            Mới
                          </span>
                        )}
                      </div>
                      {user.email && (
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    {user.isSelected && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Không tìm thấy người dùng nào</p>
              <p className="text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Không có người dùng nào</p>
              <p className="text-xs text-gray-400 mt-1">Hãy đăng ký thêm tài khoản để test</p>
            </div>
          )}
        </>
      )}

      {/* Footer thông tin */}
      {hasUsers && !searchTerm && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Hiển thị {users.length} người dùng</span>
            <span>Giới hạn: 20</span>
          </div>
        </div>
      )}
    </div>
  );
} 