'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/common/stores/authStore';

export default function AuthError() {
  const { error, clearError } = useAuthStore();

  useEffect(() => {
    if (error) {
      // Tự động xóa lỗi sau 5 giây
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm">{error}</span>
        <button
          onClick={clearError}
          className="ml-4 text-red-700 hover:text-red-900"
        >
          ×
        </button>
      </div>
    </div>
  );
} 