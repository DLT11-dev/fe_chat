import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthError from '@/components/AuthError'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Ứng dụng chat realtime với NestJS và NextJS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 