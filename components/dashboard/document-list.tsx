'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShareDialog } from './share-dialog'
import { DocumentChat } from '../document/chat'
import { FileText, MoreVertical, User, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Document {
    id: string
    title: string
    content: string
    updatedAt: string
    author: {
        id: string
        name: string
        email: string
        role: string
    }
}

interface DocumentListProps {
    filter: 'created' | 'shared'
}

export function DocumentList({ filter }: DocumentListProps) {
    const { session, status } = useAuth()
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchDocuments = async () => {
            // Esperar a que la sesión esté lista
            if (status === 'loading') return

            // Si no hay sesión después de cargar, limpiar documentos y detener carga
            if (!session?.user?.id) {
                setDocuments([])
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch('/api/documents', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Asegurarse de incluir las credenciales
                    credentials: 'include'
                })

                if (!response.ok) {
                    const errorData = await response.text()
                    throw new Error(errorData || 'Error al cargar los documentos')
                }

                const data = await response.json()

                // Validar que data sea un array
                if (!Array.isArray(data)) {
                    throw new Error('Formato de respuesta inválido')
                }

                const filteredDocs = filter === 'created'
                    ? data.filter((doc: Document) => doc.author.id === session.user.id)
                    : data.filter((doc: Document) => doc.author.id !== session.user.id)

                setDocuments(filteredDocs)
            } catch (error: any) {
                console.error('Error fetching documents:', error)
                toast.error(error.message || 'Error al cargar los documentos')
                setDocuments([]) // Limpiar documentos en caso de error
            } finally {
                setIsLoading(false)
            }
        }

        fetchDocuments()
    }, [filter, session?.user?.id, status])

    const handleDelete = async (documentId: string) => {
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (!response.ok) {
                const errorData = await response.text()
                console.error('Error del servidor:', response.status, errorData)
                throw new Error(errorData || 'Error al eliminar el documento')
            }

            // Actualizar el estado local
            setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId))
            toast.success('Documento eliminado exitosamente')

            // Recargar los documentos
            const documentsResponse = await fetch('/api/documents', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (documentsResponse.ok) {
                const data = await documentsResponse.json()
                const filteredDocs = filter === 'created'
                    ? data.filter((doc: Document) => doc.author.id === session?.user?.id)
                    : data.filter((doc: Document) => doc.author.id !== session?.user?.id)
                setDocuments(filteredDocs)
            }
        } catch (error: any) {
            console.error('Error eliminando documento:', error)
            toast.error(error.message || 'Error al eliminar el documento')
        } finally {
            setDeleteDialogOpen(false)
            setDocumentToDelete(null)
        }
    }

    // Mostrar un mensaje de carga mientras se verifica la sesión
    if (status === 'loading') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                    <Card key={n} className="animate-pulse">
                        <CardHeader className="h-[100px] bg-muted" />
                        <CardContent className="h-[100px] bg-muted mt-4" />
                    </Card>
                ))}
            </div>
        )
    }

    // Mostrar mensaje si no hay sesión
    if (!session?.user) {
        return (
            <Card className="p-8 text-center">
                <CardDescription>
                    Debes iniciar sesión para ver los documentos.
                </CardDescription>
            </Card>
        )
    }

    // Mostrar estado de carga
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                    <Card key={n} className="animate-pulse">
                        <CardHeader className="h-[100px] bg-muted" />
                        <CardContent className="h-[100px] bg-muted mt-4" />
                    </Card>
                ))}
            </div>
        )
    }

    // Mostrar mensaje si no hay documentos
    if (documents.length === 0) {
        return (
            <Card className="p-8 text-center">
                <CardDescription>
                    {filter === 'created'
                        ? 'No has creado ningún documento aún.'
                        : 'No tienes documentos compartidos.'}
                </CardDescription>
            </Card>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                    <Card key={doc.id} className="flex flex-col">
                        <CardHeader className="space-y-0 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                    <CardTitle className="text-base truncate">
                                        {doc.title}
                                    </CardTitle>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/documents/${doc.id}`}>
                                                Ver documento
                                            </Link>
                                        </DropdownMenuItem>
                                        {doc.author.id === session.user.id && (
                                            <DropdownMenuItem onSelect={(event) => {
                                                event.preventDefault()
                                                setDocumentToDelete(doc.id)
                                                setDeleteDialogOpen(true)
                                            }}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <Badge variant={doc.author.role === 'ADMIN' ? 'default' : 'secondary'} className="h-5">
                                    <User className="w-3 h-3 mr-1" />
                                    {doc.author.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                                </Badge>
                                <Badge variant="outline" className="h-5">
                                    Team Doc
                                </Badge>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-4 flex-1">
                            <div className="space-y-4">
                                <CardDescription className="min-h-[40px]">
                                    {doc.content || 'Sin contenido'}
                                </CardDescription>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    Actualizado: {new Date(doc.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                        <CardContent className="pt-0 pb-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <DocumentChat documentId={doc.id} />
                                    <ShareDialog documentId={doc.id} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el documento.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => documentToDelete && handleDelete(documentToDelete)}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}