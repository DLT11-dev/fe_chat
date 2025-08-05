import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../stores/authStore'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL

console.log('SOCKET_URL', SOCKET_URL)

export interface SocketMessage {
  id: string
  content: string
  type: string
  senderId: number
  receiverId: number
  isRead: boolean
  isRecalled: boolean
  recalledAt?: string
  createdAt: string
  updatedAt: string
  sender?: {
    id: number
    username: string
    email: string
  }
  receiver?: {
    id: number
    username: string
    email: string
  }
}

export interface SocketEvents {
  // Gửi tin nhắn
  send_message: (data: { content: string; type?: string; receiverId: number }) => void
  
  // Tham gia cuộc trò chuyện
  join_conversation: (data: { otherUserId: number }) => void
  
  // Rời cuộc trò chuyện
  leave_conversation: (data: { otherUserId: number }) => void
  
  // Bắt đầu gõ
  typing_start: (data: { receiverId: number }) => void
  
  // Dừng gõ
  typing_stop: (data: { receiverId: number }) => void
  
  // Đánh dấu đã đọc
  mark_as_read: (data: { messageId: string }) => void
  
  // Thu hồi tin nhắn
  recall_message: (data: { messageId: string }) => void
}

export interface SocketListeners {
  // Tin nhắn mới
  new_message: (message: SocketMessage) => void
  
  // Tin nhắn đã gửi
  message_sent: (message: SocketMessage) => void
  
  // Đã tham gia cuộc trò chuyện
  joined_conversation: (data: { roomId: string; otherUserId: number }) => void
  
  // Đã rời cuộc trò chuyện
  left_conversation: (data: { roomId: string; otherUserId: number }) => void
  
  // User đang gõ
  user_typing: (data: { userId: number; username: string }) => void
  
  // User dừng gõ
  user_stopped_typing: (data: { userId: number; username: string }) => void
  
  // Tin nhắn đã được đánh dấu đọc
  message_marked_read: (data: { messageId: string }) => void
  
  // Tin nhắn đã được thu hồi
  message_recalled: (data: { messageId: string }) => void
  
  // Lỗi
  error: (error: { message: string }) => void
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const listenersRef = useRef<Map<string, Function[]>>(new Map())
  const hasConnected = useRef(false) // Thêm flag để theo dõi việc đã kết nối chưa

  const {token} = useAuthStore()

  const connect = useCallback(() => {
    if (socketRef.current?.connected || hasConnected.current) return

    // Get token from auth store
    const authStorage = localStorage.getItem('auth-storage')
    let token = null
    
    if (authStorage) {
      try {
        const auth = JSON.parse(authStorage)
        token = auth.state?.token || null
      } catch (error) {
        console.error('Error parsing auth storage:', error)
      }
    }

    if (!token) {
      console.error('❌ No access token found for socket connection')
      return
    }

    console.log('🔌 Connecting to socket server with token:', token.substring(0, 20) + '...')

    socketRef.current = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to socket server')
      hasConnected.current = true
    })

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from socket server')
      hasConnected.current = false
    })

    socketRef.current.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      hasConnected.current = false
    }
  }, [])

  const emit = useCallback(<K extends keyof SocketEvents>(
    event: K,
    data: Parameters<SocketEvents[K]>[0]
  ) => {
    if (socketRef.current?.connected) {
      console.log('📤 Emitting event:', event, data)
      socketRef.current.emit(event, data)
    } else {
      console.error('❌ Socket not connected, cannot emit:', event)
    }
  }, [])

  const on = useCallback(<K extends keyof SocketListeners>(
    event: K,
    callback: SocketListeners[K]
  ) => {
    console.log('👂 Adding listener for event:', event)
    
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, [])
    }
    listenersRef.current.get(event)?.push(callback)

    if (socketRef.current) {
      socketRef.current.on(event, callback as any)
    }

    return () => {
      console.log('👂 Removing listener for event:', event)
      const listeners = listenersRef.current.get(event) || []
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
      
      if (socketRef.current) {
        socketRef.current.off(event, callback as any)
      }
    }
  }, [])

  const off = useCallback(<K extends keyof SocketListeners>(
    event: K,
    callback?: SocketListeners[K]
  ) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback as any)
      } else {
        socketRef.current.off(event)
      }
    }
  }, [])

  useEffect(() => {
    // Chỉ kết nối một lần khi component mount
    if (!hasConnected.current) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, []) // Bỏ dependencies để tránh re-run

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    emit,
    on,
    off,
    isConnected: socketRef.current?.connected || false
  }
} 
