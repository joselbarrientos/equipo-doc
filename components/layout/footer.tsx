import Link from 'next/link'

export function Footer() {
    return (
        <footer className="py-6 px-6 bg-background border-t">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm text-muted-foreground">
                        © 2024 team-doc. Todos los derechos reservados.
                    </p>
                </div>
                <nav className="flex space-x-4">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                        Términos de servicio
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                        Política de privacidad
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                        Contacto
                    </Link>
                </nav>
            </div>
        </footer>
    )
}