'use client'

import { useSession } from 'next-auth/react'

export function useAuth() {
    const { data: session, status } = useSession()

    return {
        session,
        status,
        isAdmin: session?.user?.role === 'ADMIN',
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
    }
}