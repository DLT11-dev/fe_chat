# Chat App Frontend

Ứng dụng chat realtime được xây dựng với Next.js 14 và TypeScript.

## Tính năng

- **Authentication**: Đăng nhập/đăng ký với JWT
- **Protected Routes**: Bảo vệ các trang cần authentication
- **Real-time Chat**: Giao diện chat với WebSocket (sẽ được tích hợp)
- **Responsive Design**: Giao diện responsive với Tailwind CSS
- **State Management**: Quản lý state với Zustand

## Cấu trúc thư mục

```
frontend/
├── app/                    # Next.js App Router
│   ├── chat/              # Trang chat
│   ├── login/             # Trang đăng nhập
│   ├── register/          # Trang đăng ký
│   └── layout.tsx         # Layout chính
├── components/            # React components
│   ├── chat/             # Components cho chat
│   ├── LoginForm.tsx     # Form đăng nhập
│   ├── RegisterForm.tsx  # Form đăng ký
│   ├── ProtectedRoute.tsx # Bảo vệ route
│   └── AuthError.tsx     # Hiển thị lỗi auth
├── common/               # Shared code
│   ├── stores/          # Zustand stores
│   ├── modules/         # API modules
│   ├── constants/       # Constants
│   └── lib/            # Utilities
└── package.json
```

## Luồng hoạt động

### Trang chủ (/)
- Nếu chưa đăng nhập → Chuyển hướng đến `/login`
- Nếu đã đăng nhập → Hiển thị trang chat

### Trang chat (/chat)
- Yêu cầu authentication
- Hiển thị giao diện chat với sidebar, header, message list và input
- Có nút đăng xuất trong header

### Authentication
- Sử dụng JWT tokens (access_token + refresh_token)
- Tự động refresh token khi cần thiết
- Lưu trữ state trong localStorage với Zustand persist

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## Environment Variables

Tạo file `.env.local` với các biến môi trường:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API Integration

Ứng dụng được thiết kế để tích hợp với backend NestJS:
- Authentication endpoints
- WebSocket cho real-time chat
- REST API cho quản lý tin nhắn và phòng chat

## Components chính

### ProtectedRoute
Bảo vệ các trang cần authentication, tự động chuyển hướng nếu chưa đăng nhập.

### ChatApp
Component chính cho giao diện chat, bao gồm:
- Sidebar: Danh sách phòng chat
- ChatHeader: Header với thông tin người dùng và nút logout
- MessageList: Danh sách tin nhắn
- MessageInput: Input để gửi tin nhắn

### AuthError
Hiển thị thông báo lỗi authentication với auto-dismiss.

## State Management

Sử dụng Zustand với persist middleware để lưu trữ:
- User information
- Authentication tokens
- Authentication state

## Styling

Sử dụng Tailwind CSS cho styling với:
- Responsive design
- Dark/light mode support (có thể mở rộng)
- Custom components 