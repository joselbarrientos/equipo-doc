'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ChevronRight, ChevronDown, Folder, FolderPlus, File, Plus } from 'lucide-react'

interface FolderItem {
    id: string
    name: string
    type: 'folder' | 'file'
    children?: FolderItem[]
}

export function FolderTree() {
    const [items, setItems] = useState<FolderItem[]>([
        {
            id: '1',
            name: 'Documentos',
            type: 'folder',
            children: [
                {
                    id: '2',
                    name: 'Proyectos',
                    type: 'folder',
                    children: [
                        { id: '3', name: 'Proyecto A', type: 'file' },
                        { id: '4', name: 'Proyecto B', type: 'file' },
                    ],
                },
                { id: '5', name: 'Guías', type: 'folder', children: [] },
            ],
        },
    ])
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']))
    const [newFolderName, setNewFolderName] = useState('')
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

    const toggleFolder = (folderId: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId)
        } else {
            newExpanded.add(folderId)
        }
        setExpandedFolders(newExpanded)
    }

    const renderItem = (item: FolderItem, level: number = 0) => {
        const isExpanded = expandedFolders.has(item.id)

        return (
            <div key={item.id}>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <Button
                            variant="ghost"
                            className="w-full justify-start px-2 hover:bg-accent"
                            onClick={() => item.type === 'folder' && toggleFolder(item.id)}
                        >
                            <div style={{ marginLeft: `${level * 12}px` }} className="flex items-center">
                                {item.type === 'folder' && (
                                    isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />
                                )}
                                {item.type === 'folder' ? (
                                    <Folder className="h-4 w-4 mr-2" />
                                ) : (
                                    <File className="h-4 w-4 mr-2" />
                                )}
                                {item.name}
                            </div>
                        </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        {item.type === 'folder' && (
                            <>
                                <ContextMenuItem onClick={() => setSelectedFolder(item.id)}>
                                    Nueva carpeta
                                </ContextMenuItem>
                                <ContextMenuItem>Nuevo documento</ContextMenuItem>
                            </>
                        )}
                        <ContextMenuItem className="text-red-600">Eliminar</ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
                {item.type === 'folder' && item.children && isExpanded && (
                    <div>
                        {item.children.map((child) => renderItem(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Carpetas</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <FolderPlus className="h-4 w-4 mr-2" />
                            Nueva carpeta
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nueva carpeta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <Input
                                placeholder="Nombre de la carpeta"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                            />
                            <Button className="w-full" onClick={() => setNewFolderName('')}>
                                Crear carpeta
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-lg">
                {items.map((item) => renderItem(item))}
            </div>
        </div>
    )
}