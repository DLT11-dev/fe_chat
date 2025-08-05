export interface Message {
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
  
  export interface CreateMessageDto {
    content: string
    type?: string
    receiverId: number
  }
  
  export interface Conversation {
    otherUserId: number
    lastMessageTime: string
    unreadCount: number
    user: {
      id: number
      username: string
      email: string
    }
  }
  