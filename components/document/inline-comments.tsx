'use client'

import { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { MessageSquarePlus } from 'lucide-react'

interface Comment {
    id: string
    content: string
    user: {
        name: string
        image?: string
    }
    createdAt: Date
    position: {
        start: number
        end: number
    }
}

export function InlineComments() {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [selectedText, setSelectedText] = useState('')
    const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null)

    const handleTextSelection = () => {
        const selection = window.getSelection()
        if (selection && selection.toString().length > 0) {
            setSelectedText(selection.toString())
            const range = selection.getRangeAt(0)
            setSelectionRange({
                start: range.startOffset,
                end: range.endOffset,
            })
        }
    }

    const handleAddComment = () => {
        if (!newComment.trim() || !selectionRange) return

        const comment: Comment = {
            id: Date.now().toString(),
            content: newComment,
            user: {
                name: 'Tú',
                image: '/placeholder.svg?height=32&width=32',
            },
            createdAt: new Date(),
            position: selectionRange,
        }

        setComments([...comments, comment])
        setNewComment('')
        setSelectedText('')
        setSelectionRange(null)
    }

    return (
        <div onMouseUp={handleTextSelection}>
            {selectedText && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute"
                            style={{
                                top: window.getSelection()?.getRangeAt(0).getBoundingClientRect().top + window.scrollY - 40,
                                left: window.getSelection()?.getRangeAt(0).getBoundingClientRect().left,
                            }}
                        >
                            <MessageSquarePlus className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Texto seleccionado:</div>
                                <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                                    {selectedText}
                                </div>
                            </div>
                            <Textarea
                                placeholder="Añade un comentario..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button onClick={handleAddComment} className="w-full">
                                Añadir comentario
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            )}

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 p-4 border rounded-lg">
                        <Avatar>
                            <AvatarImage src={comment.user.image} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                      locale: es,
                  })}
                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.content}</p>
                            <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded-md">
                                {selectedText.substring(comment.position.start, comment.position.end)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}