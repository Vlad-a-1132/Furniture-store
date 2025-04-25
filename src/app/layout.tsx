import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import Providers from '@/components/Providers'
import './globals.css'
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Furniture Store',
  description: 'Магазин мебели',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <Toaster richColors position="top-right" />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
} 