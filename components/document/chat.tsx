'use client'

import { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/hooks/use-socket'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Message {
    id: string
    content: string
    user: {
        name: string
        image?: string
        role?: string
    }
    createdAt: Date
}

interface DocumentChatProps {
    documentId: string
}

export function DocumentChat({ documentId }: DocumentChatProps) {
    const { session } = useAuth()
    const { socket, sendMessage } = useSocket(documentId)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const { isAdmin } = useAuth()

    useEffect(() => {
        if (!socket) return

        // Cargar mensajes existentes
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/documents/${documentId}/messages`)
                const data = await response.json()
                setMessages(data)
            } catch (error) {
                console.error('Error al cargar mensajes:', error)
            }
        }

        fetchMessages()

        // Escuchar nuevos mensajes
        socket.on('new-message', (message: Message) => {
            setMessages((prev) => [...prev, message])
        })

        return () => {
            socket.off('new-message')
        }
    }, [socket, documentId])

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !session?.user) return

        try {
            await sendMessage(newMessage)
            setNewMessage('')
        } catch (error) {
            console.error('Error al enviar mensaje:', error)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <MessageCircle className="h-4 w-4" />
                    {messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {messages.length}
            </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Chat del documento</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full pt-4">
                    <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarImage src={message.user.image} alt={message.user.name} />
                                        <AvatarFallback>
                                            {message.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {message.user.name}
                      </span>
                                            {message.user.role === 'ADMIN' && (
                                                <Shield className="h-3 w-3 text-primary" />
                                            )}
                                            <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                            locale: es,
                        })}
                      </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleSendMessage} className="flex gap-2 pt-4">
                        <Input
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit">Enviar</Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}