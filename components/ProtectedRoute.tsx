'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/common/stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
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
          // Chỉ gọi checkAuth nếu token không phải vừa được tạo từ đăng nhập
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

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, điều hướng đến trang được chỉ định
  if (!isAuthenticated) {
    router.push(redirectTo);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập, hiển thị nội dung được bảo vệ
  return <>{children}</>;
} 