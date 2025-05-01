'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export function CreateDocument() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content: '' }),
            })

            if (!response.ok) {
                throw new Error('Error al crear el documento')
            }

            const document = await response.json()
            toast.success('Documento creado exitosamente')
            setOpen(false)
            router.push(`/documents/${document.id}`)
            router.refresh()
        } catch (error) {
            toast.error('Error al crear el documento')
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo documento
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nuevo documento</DialogTitle>
                    <DialogDescription>
                        Ingresa el título de tu nuevo documento
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Título del documento"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={!title || isLoading}>
                            {isLoading ? 'Creando...' : 'Crear documento'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}