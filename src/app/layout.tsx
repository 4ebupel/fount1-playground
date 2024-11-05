'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import { UserProvider } from './contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/images/Logo-04.svg" type="image/png" />
      <title>Fount.one</title>
      <body className={inter.className}>
        <SessionProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  )
}