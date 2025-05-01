'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
    ScrollText,
    Layout,
    Settings,
    LogOut,
    Users,
    FileText,
    BarChart
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function Sidebar() {
    const pathname = usePathname()
    const { isAdmin } = useAuth()

    const adminNavigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Layout,
        },
        {
            name: 'Usuarios',
            href: '/admin/users',
            icon: Users,
        },
      /*  {
            name: 'Documentos',
            href: '/documents',
            icon: ScrollText,
        },*/
        {
            name: 'Reportes',
            href: '/admin/reports',
            icon: BarChart,
        },
        {
            name: 'Configuración',
            href: '/settings',
            icon: Settings,
        },
    ]

    const userNavigation = [
        {
            name: 'Mis documentos',
            href: '/dashboard',
            icon: FileText,
        },
        /*{
            name: 'Documentos compartidos',
            href: '/documents/shared',
            icon: ScrollText,
        },*/
        {
            name: 'Configuración',
            href: '/settings',
            icon: Settings,
        },
    ]

    const navigation = isAdmin ? adminNavigation : userNavigation

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/' })
    }

    return (
        <div className="w-64 border-r bg-background p-4 flex flex-col h-full">
            <div className="flex items-center mb-8">
                <h1 className="text-2xl font-bold">team-doc</h1>
                {isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        Admin
                    </span>
                )}
            </div>
            <nav className="space-y-2 flex-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Button>
                        </Link>
                    )
                })}
            </nav>
            <Button
                variant="ghost"
                className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
            >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
            </Button>
        </div>
    )
}