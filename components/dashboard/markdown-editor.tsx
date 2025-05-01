import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Bold,
    Italic,
    List,
    Heading1,
    Heading2,
    Code,
    Quote,
    GitBranch
} from 'lucide-react'

const toolbarItems = [
    { icon: Bold, action: '**', label: 'Negrita' },
    { icon: Italic, action: '_', label: 'Cursiva' },
    { icon: Heading1, action: '# ', label: 'Título 1', block: true },
    { icon: Heading2, action: '## ', label: 'Título 2', block: true },
    { icon: List, action: '- ', label: 'Lista', block: true },
    { icon: Code, action: '`', label: 'Código' },
    { icon: Quote, action: '> ', label: 'Cita', block: true },
    { icon: GitBranch, action: '\n```mermaid\ngraph TD;\nA-->B;\nB-->C;\nC-->D;\n```\n', label: 'Diagrama Mermaid', block: true },
]

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const [localValue, setLocalValue] = useState(value)
    const [mermaidInstance, setMermaidInstance] = useState<any>(null)
    const [isMermaidLoading, setIsMermaidLoading] = useState(true)

    useEffect(() => {
        const loadMermaid = async () => {
            try {
                const mermaid = (await import('mermaid')).default
                await mermaid.initialize({
                    startOnLoad: false,
                    theme: 'default',
                    securityLevel: 'loose',
                    fontFamily: 'inherit',
                })
                setMermaidInstance(mermaid)
                setIsMermaidLoading(false)
            } catch (error) {
                console.error('Error loading Mermaid:', error)
                setIsMermaidLoading(false)
            }
        }
        loadMermaid()
    }, [])

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleChange = useCallback((newValue: string) => {
        setLocalValue(newValue)
        onChange(newValue)
    }, [onChange])

    const handleToolbarAction = useCallback((action: string, isBlock: boolean = false) => {
        const textarea = document.querySelector('textarea')
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value

        let newText
        if (isBlock) {
            const beforeSelection = text.slice(0, start)
            const selection = text.slice(start, end)
            const afterSelection = text.slice(end)
            newText = beforeSelection + action + selection + afterSelection
        } else {
            const beforeSelection = text.slice(0, start)
            const selection = text.slice(start, end)
            const afterSelection = text.slice(end)
            newText = beforeSelection + action + selection + action + afterSelection
        }

        handleChange(newText)
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(
                start + action.length,
                end + action.length
            )
        }, 0)
    }, [handleChange])

    const MermaidDiagram = ({ chart }: { chart: string }) => {
        const elementRef = useRef<HTMLDivElement>(null)
        const [error, setError] = useState<string | null>(null)
        const [key, setKey] = useState(0)

        useEffect(() => {
            const renderDiagram = async () => {
                if (!elementRef.current || !mermaidInstance || isMermaidLoading) return

                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

                    // Crear un nuevo div para el diagrama
                    const container = document.createElement('div')
                    container.id = id

                    // Limpiar el contenedor de referencia de forma segura
                    while (elementRef.current.firstChild) {
                        elementRef.current.removeChild(elementRef.current.firstChild)
                    }

                    // Renderizar el diagrama
                    const { svg } = await mermaidInstance.render(id, chart.trim())

                    // Actualizar el contenido de forma segura
                    if (elementRef.current) {
                        elementRef.current.innerHTML = svg
                    }

                    setError(null)
                } catch (err) {
                    console.error('Error rendering Mermaid diagram:', err)
                    setError('Error al renderizar el diagrama. Verifica la sintaxis.')
                    setKey(prev => prev + 1) // Forzar re-render en caso de error
                }
            }

            renderDiagram()
        }, [chart, mermaidInstance, isMermaidLoading, key])

        if (isMermaidLoading) {
            return <div className="p-4">Cargando Mermaid...</div>
        }

        if (error) {
            return (
                <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
                    {error}
                    <pre className="mt-2 text-xs overflow-auto">{chart}</pre>
                </div>
            )
        }

        return <div ref={elementRef} className="my-4" key={key} />
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 bg-background border rounded-md p-2">
                {toolbarItems.map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToolbarAction(item.action, item.block)}
                        title={item.label}
                    >
                        <item.icon className="h-4 w-4" />
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Textarea
                        value={localValue}
                        onChange={(e) => handleChange(e.target.value)}
                        className="min-h-[500px] font-mono"
                        placeholder="Escribe tu documento en Markdown..."
                    />
                </div>
                <div className="border rounded-md p-4 overflow-auto max-h-[500px] prose prose-sm dark:prose-invert">
                    <ReactMarkdown
                        components={{
                            code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                if (match && match[1] === 'mermaid') {
                                    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
                                }
                                return <code className={className} {...props}>{children}</code>
                            }
                        }}
                    >
                        {localValue}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default MarkdownEditor