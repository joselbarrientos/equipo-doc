'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Tag } from 'lucide-react'

interface TagProps {
    id: string
    name: string
    color: string
}

export function TagManager() {
    const [tags, setTags] = useState<TagProps[]>([
        { id: '1', name: 'Importante', color: 'red' },
        { id: '2', name: 'En progreso', color: 'yellow' },
        { id: '3', name: 'Completado', color: 'green' },
    ])
    const [newTagName, setNewTagName] = useState('')
    const [selectedColor, setSelectedColor] = useState('blue')

    const colors = [
        'red',
        'yellow',
        'green',
        'blue',
        'purple',
        'pink',
    ]

    const addTag = () => {
        if (newTagName.trim()) {
            setTags([
                ...tags,
                {
                    id: Date.now().toString(),
                    name: newTagName.trim(),
                    color: selectedColor,
                },
            ])
            setNewTagName('')
        }
    }

    const removeTag = (id: string) => {
        setTags(tags.filter((tag) => tag.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Etiquetas</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva etiqueta
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nueva etiqueta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <Input
                                placeholder="Nombre de la etiqueta"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Color</label>
                                <div className="flex gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`w-6 h-6 rounded-full ${
                                                selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button className="w-full" onClick={addTag}>
                                Crear etiqueta
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag.id}
                        variant="outline"
                        className="flex items-center gap-1"
                        style={{ backgroundColor: `${tag.color}20` }}
                    >
                        <Tag className="h-3 w-3" style={{ color: tag.color }} />
                        {tag.name}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag.id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}