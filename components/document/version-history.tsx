'use client'

import { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Version {
    id: string
    user: {
        name: string
        image?: string
    }
    createdAt: Date
    changes: string[]
}

export function VersionHistory() {
    const [versions, setVersions] = useState<Version[]>([
        {
            id: '1',
            user: {
                name: 'Ana García',
                image: '/placeholder.svg?height=32&width=32',
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
            changes: [
                'Añadida introducción',
                'Corregidos errores tipográficos',
            ],
        },
        {
            id: '2',
            user: {
                name: 'Carlos López',
                image: '/placeholder.svg?height=32&width=32',
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            changes: [
                'Actualizada la sección de  metodología',
                'Añadidas referencias',
            ],
        },
    ])

    const handleRestore = (versionId: string) => {
        // Aquí implementarías la lógica para restaurar una versión
        console.log('Restaurando versión:', versionId)
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Historial de versiones</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                    <div className="space-y-4 pt-4">
                        {versions.map((version) => (
                            <div
                                key={version.id}
                                className="flex flex-col space-y-2 border-b pb-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Avatar>
                                            <AvatarImage src={version.user.image} alt={version.user.name} />
                                            <AvatarFallback>{version.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{version.user.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(version.createdAt, {
                                                    addSuffix: true,
                                                    locale: es,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRestore(version.id)}
                                    >
                                        Restaurar
                                    </Button>
                                </div>
                                <div className="ml-10 space-y-1">
                                    {version.changes.map((change, index) => (
                                        <p key={index} className="text-sm text-muted-foreground">
                                            • {change}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}