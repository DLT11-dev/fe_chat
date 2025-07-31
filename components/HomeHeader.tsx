'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, MessageCircle, Users, Zap } from 'lucide-react';
import PAGE_URLS from '@/common/constants/pageUrls';

export default function HomeHeader() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push(PAGE_URLS.LOGIN);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ChatApp</h1>
              <p className="text-sm text-blue-100">Kết nối mọi người</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
              <Zap className="w-4 h-4" />
              <span>Tính năng</span>
            </a>
            <a href="#about" className="flex items-center space-x-2 hover:text-blue-200 transition-colors">
              <Users className="w-4 h-4" />
              <span>Về chúng tôi</span>
            </a>
          </nav>

          {/* Login Button */}
          <button
            onClick={handleLoginClick}
            className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập</span>
          </button>
        </div>
      </div>
    </header>
  );
} 