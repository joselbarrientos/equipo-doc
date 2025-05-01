'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

interface Notification {
    id: string
    message: string
    documentId: string
    createdAt: string
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [open, setOpen] = useState(false)

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Error al cargar notificaciones')
            }

            const data = await response.json()
            setNotifications(data)
        } catch (error) {
            console.error('Error fetching notifications:', error)
            toast.error('Error al cargar notificaciones')
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleNotificationClick = async (notificationId: string, documentId: string) => {
        try {
            // Mark notification as read
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            // Remove the notification from the list
            setNotifications(prev => prev.filter(n => n.id !== notificationId))

            // Navigate to the document
            window.location.href = `/documents/${documentId}`
        } catch (error) {
            console.error('Error handling notification:', error)
            toast.error('Error al procesar la notificación')
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h3 className="font-semibold mb-2">Notificaciones</h3>
                {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No tienes notificaciones nuevas.</p>
                ) : (
                    <ScrollArea className="h-64">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleNotificationClick(notification.id, notification.documentId)}
                            >
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </ScrollArea>
                )}
            </PopoverContent>
        </Popover>
    )
}