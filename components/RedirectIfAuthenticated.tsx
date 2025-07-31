'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/common/stores/authStore';

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function RedirectIfAuthenticated({ 
  children, 
  redirectTo = '/chat' 
}: RedirectIfAuthenticatedProps) {
  const router = useRouter();
  const { isAuthenticated, checkAuth, isTokenFresh } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Kiểm tra xem có token trong localStorage không
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (token && savedUser) {
          if (!isTokenFresh) {
            await checkAuth();
          }
        }
      } catch (error) {
        console.error('Lỗi khởi tạo authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuth, isTokenFresh]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang chuyển hướng đến chat...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 