'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

export function useSocket(documentId: string) {
    const { session } = useAuth()
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!session?.user?.id || !documentId) return

        // Inicializar Socket.io con la configuración correcta
        socketRef.current = io('http://localhost:3000', {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            withCredentials: true,
            auth: {
                token: session.user.id,
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })

        // Manejar eventos de conexión
        socketRef.current.on('connect', () => {
            console.log('Conectado al servidor de Socket.io')
            setIsConnected(true)

            // Unirse a la sala del documento
            socketRef.current?.emit('join-document', {
                documentId,
                userId: session.user.id,
            })
        })

        socketRef.current.on('connect_error', (error) => {
            console.error('Error de conexión:', error)
            toast.error('Error de conexión con el chat')
        })

        socketRef.current.on('error', (error) => {
            console.error('Socket error:', error)
            toast.error(error.message || 'Error en el chat')
        })

        socketRef.current.on('disconnect', () => {
            console.log('Desconectado del servidor')
            setIsConnected(false)
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [documentId, session?.user?.id])

    const sendMessage = async (content: string) => {
        if (!socketRef.current || !session?.user?.id || !isConnected) {
            toast.error('No hay conexión con el chat')
            return
        }

        try {
            socketRef.current.emit('send-message', {
                documentId,
                content,
                userId: session.user.id,
            })
        } catch (error) {
            console.error('Error al enviar mensaje:', error)
            toast.error('Error al enviar el mensaje')
        }
    }

    return {
        socket: socketRef.current,
        isConnected,
        sendMessage,
    }
}