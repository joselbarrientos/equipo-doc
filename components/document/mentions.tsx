'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AtSign, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface User {
    id: string
    name: string
    email: string
    image?: string
    role: string
}

interface MentionsProps {
    onMention: (user: User) => void
}

export function Mentions({ onMention }: MentionsProps) {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUsers = useCallback(async () => {
        if (!open) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'Error al cargar usuarios')
            }

            const data = await response.json()
            if (!Array.isArray(data)) {
                throw new Error('Formato de respuesta inválido')
            }

            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
            setError(error instanceof Error ? error.message : 'Error al cargar usuarios')
            toast.error('Error al cargar usuarios')
        } finally {
            setIsLoading(false)
        }
    }, [open])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = useCallback((user: User) => {
        onMention(user)
        setOpen(false)
        setSearch('')
    }, [onMention])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Mencionar usuario"
                >
                    <AtSign className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput 
                        placeholder="Buscar usuario..." 
                        value={search} 
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="ml-2">Cargando usuarios...</span>
                                </div>
                            </CommandEmpty>
                        ) : error ? (
                            <CommandEmpty>
                                <div className="text-red-500 p-2">
                                    {error}
                                </div>
                            </CommandEmpty>
                        ) : filteredUsers.length === 0 ? (
                            <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filteredUsers.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={user.name}
                                        onSelect={() => handleSelect(user)}
                                        className="flex items-center gap-2 p-2"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.image} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email} • {user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}