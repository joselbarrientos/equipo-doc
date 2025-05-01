'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {Search, SlidersHorizontal, Tag, Calendar, User, X} from 'lucide-react'

export function SearchFilters() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const availableTags = [
        'Importante',
        'En progreso',
        'Completado',
        'Borrador',
        'Revisión',
    ]

    const toggleTag = (tag: string) => {
        setSelectedTags(
            selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag]
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar documentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filtros
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Filtros de búsqueda</SheetTitle>
                            <SheetDescription>
                                Aplica filtros para encontrar documentos específicos
                            </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de documento</label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="document">Documento</SelectItem>
                                        <SelectItem value="roadmap">Roadmap</SelectItem>
                                        <SelectItem value="guide">Guía</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha de modificación</label>
                                <Select value={selectedDate} onValueChange={setSelectedDate}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Hoy</SelectItem>
                                        <SelectItem value="week">Última semana</SelectItem>
                                        <SelectItem value="month">Último mes</SelectItem>
                                        <SelectItem value="year">Último año</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Etiquetas</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => {}}>
                                Aplicar filtros
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            {(selectedType || selectedDate || selectedTags.length > 0) && (
                <div className="flex flex-wrap gap-2">
                    {selectedType && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {selectedType}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => setSelectedType('')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {selectedDate && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {selectedDate}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => setSelectedDate('')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center  gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => toggleTag(tag)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}