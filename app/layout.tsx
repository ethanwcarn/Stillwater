import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './providers'
import { GlobalNav } from '@/components/global-nav' // Import the new nav


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stillwaters — Faith-Integrated Mental Health',
  description: 'Connect with faith-aware mental health support and community.',
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <AuthProvider>
          <GlobalNav /> { /* nav is now glbal and has sign out */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}