import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
    return (
        <header className="py-4 px-6 bg-background border-b">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-primary">
                    team-doc
                </Link>
                <nav className="space-x-4">
                    <Link href="#features" className="text-muted-foreground hover:text-primary">
                        Características
                    </Link>
                    <Link href="#pricing" className="text-muted-foreground hover:text-primary">
                        Precios
                    </Link>
                    <Link href="/login">
                        <Button variant="outline">Iniciar sesión</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Registrarse</Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}