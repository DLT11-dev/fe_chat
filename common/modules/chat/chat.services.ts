import API_URLS from '@/common/constants/apiUrls'
import httpService from '@/common/lib/api'
import { Conversation, CreateMessageDto, Message } from './chat.interface'


class ChatService {
  // Gửi tin nhắn mới
  async sendMessage(data: CreateMessageDto): Promise<Message> {
    return httpService.post<Message>(API_URLS.CHAT_MESSAGES, data)
  }

  // Lấy tin nhắn giữa 2 người dùng
  async getMessages(otherUserId: number, limit = 50, offset = 0): Promise<Message[]> {
    return httpService.get<Message[]>(`${API_URLS.CHAT_MESSAGES}/${otherUserId}?limit=${limit}&offset=${offset}`)
  }

  // Lấy tin nhắn chưa đọc
  async getUnreadMessages(): Promise<Message[]> {
    return httpService.get<Message[]>(`${API_URLS.CHAT_MESSAGES}/unread`)
  }

  // Đánh dấu tin nhắn là đã đọc
  async markMessageAsRead(messageId: string): Promise<void> {
    return httpService.put<void>(`${API_URLS.CHAT_MESSAGES}/${messageId}/read`)
  }

  // Đánh dấu tất cả tin nhắn từ người dùng là đã đọc
  async markAllMessagesAsRead(otherUserId: number): Promise<void> {
    return httpService.put<void>(`${API_URLS.CHAT_MESSAGES}/read/${otherUserId}`)
  }

  // Xóa tin nhắn
  async deleteMessage(messageId: string): Promise<void> {
    return httpService.delete<void>(`${API_URLS.CHAT_MESSAGES}/${messageId}`)
  }

  // Thu hồi tin nhắn
  async recallMessage(messageId: string): Promise<void> {
    return httpService.put<void>(`${API_URLS.CHAT_MESSAGES}/${messageId}/recall`)
  }

  // Lấy danh sách cuộc trò chuyện gần đây
  async getRecentConversations(): Promise<Conversation[]> {
    return httpService.get<Conversation[]>('/chat/conversations')
  }

  // Lấy danh sách users (trừ user hiện tại) - giới hạn 20 users
  async getUsers(limit: number = 20, offset: number = 0): Promise<any[]> {
    return httpService.get<any[]>(`${API_URLS.USERS}?limit=${limit}&offset=${offset}`)
  }

  // Tìm kiếm người dùng
  async searchUsers(query: string, limit: number = 20): Promise<any[]> {
    return httpService.get<any[]>(`${API_URLS.USERS}/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  }
}

const chatService = new ChatService()

export default chatService 