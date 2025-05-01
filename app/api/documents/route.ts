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

        const documents = await prisma.document.findMany({
            where: {
                OR: [
                    { authorId: session.user.id },
                    {
                        collaborators: {
                            some: {
                                id: session.user.id,
                            },
                        },
                    },
                ],
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })

        return NextResponse.json(documents)
    } catch (error) {
        console.error('Error al obtener documentos:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        const { title, content } = await request.json()

        if (!title) {
            return new NextResponse('El título es requerido', { status: 400 })
        }

        const document = await prisma.document.create({
            data: {
                title,
                content: content || '',
                author: {
                    connect: { id: session.user.id }
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        })

        return NextResponse.json(document)
    } catch (error) {
        console.error('Error al crear documento:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}


