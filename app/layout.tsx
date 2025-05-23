import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { NextAuthProvider } from '@/providers/next-auth'
import './globals.css'
import {NotificationBell} from "@/components/layout/notification-bell";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
        <body className={inter.className}>
        <NextAuthProvider>
                {children}

        </NextAuthProvider>
        </body>
        </html>
    )
}