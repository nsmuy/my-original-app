import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from "../auth/AuthContext";
import Header from '@/components/common/Header';

export const metadata: Metadata = {
  title: 'MY FOUNDATION FINDER',
  description: '特徴を比較して、自分にピッタリのファンデーションを見つけよう',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className='w-full h-full'>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
