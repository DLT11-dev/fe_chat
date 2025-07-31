'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/common/stores/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthError from '@/components/AuthError';
// import { UserService } from '@/common/modules/users/users.service';

interface ProfileFormData {
  username: string;
  email: string;
  avatar: string;
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();

  // useEffect(() => {
  //   // Kiểm tra xem có token trong localStorage không
  //   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  //   const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
  //   if (!isAuthenticated && !token) {
  //     router.push('/login');
  //     return;
  //   }

  //   if (user) {
  //     setValue('username', user.username);
  //     setValue('email', user.email);
  //     setValue('avatar', user.avatar || '');
  //   }
  // }, [isAuthenticated, user, router, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // try {
    //   const response = await userAPI.updateProfile(data);
      
    //   // Update local state
    //   login(response.data, (typeof window !== 'undefined' ? localStorage.getItem('token') : null) || '');
      
    //   setSuccess('Cập nhật thông tin thành công!');
    // } catch (err: any) {
    //   setError(err.response?.data?.message || 'Cập nhật thất bại');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <ProtectedRoute>
      <AuthError />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Cập nhật thông tin</h1>
            <button
              onClick={() => router.push('/chat')}
              className="text-primary-600 hover:text-primary-500"
            >
              ← Quay lại
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Preview */}
            <div className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-medium text-gray-600">
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng
              </label>
              <input
                {...register('username', {
                  required: 'Tên người dùng là bắt buộc',
                  minLength: {
                    value: 3,
                    message: 'Tên người dùng phải có ít nhất 3 ký tự',
                  },
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nhập tên người dùng"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ',
                  },
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Avatar (tùy chọn)
              </label>
              <input
                {...register('avatar')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nhập URL hình ảnh để cập nhật avatar
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {success && (
              <div className="text-green-600 text-sm text-center">{success}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
} 