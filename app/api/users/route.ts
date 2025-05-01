import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        // Excluir el usuario actual de la lista
        const users = await prisma.user.findMany({
            where: {
                NOT: {
                    id: session.user.id
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}