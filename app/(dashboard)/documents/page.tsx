'use client'

import { useState } from 'react'
import { MarkdownEditor } from '@/components/dashboard/markdown-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShareDialog } from '@/components/dashboard/share-dialog'

export default function NewDocumentPage() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleSave = async () => {
        // Aquí implementarías la lógica de guardado
        console.log({ title, content })
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Input
                    type="text"
                    placeholder="Título del documento"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold w-[300px]"
                />
                <div className="space-x-2">
                    <ShareDialog />
                    <Button onClick={handleSave}>Guardar</Button>
                </div>
            </div>
            <MarkdownEditor value={content} onChange={setContent} />
        </div>
    )
}