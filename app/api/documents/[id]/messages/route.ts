import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        const documentId = await Promise.resolve(params.id)

        const messages = await prisma.message.findMany({
            where: {
                documentId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        return NextResponse.json(messages)
    } catch (error) {
        console.error('Error al obtener mensajes:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}