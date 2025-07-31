'use client';

import React from 'react';
import { User, Wifi, WifiOff } from 'lucide-react';

interface ChatHeaderProps {
  selectedUser: { id: number; username: string } | null;
  isConnected: boolean;
}

export default function ChatHeader({ selectedUser, isConnected }: ChatHeaderProps) {

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        {selectedUser ? (
          <>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {selectedUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-semibold">{selectedUser.username}</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <p className="text-xs text-gray-500">
                  {isConnected ? 'Đang hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500">Chọn người dùng để bắt đầu chat</h2>
              <p className="text-xs text-gray-400">Chọn từ danh sách bên trái</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-xs text-gray-500">
            {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          </span>
        </div>
      </div>
    </div>
  );
}
