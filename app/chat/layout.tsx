import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AuthError from '@/components/AuthError'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat - ChatApp',
  description: 'Trò chuyện realtime với bạn bè',
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthError />
        {children}
      </body>
    </html>
  )
} 