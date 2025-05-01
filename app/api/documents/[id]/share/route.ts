import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        const documentId = await Promise.resolve(context.params.id)
        const { email } = await request.json()

        if (!documentId) {
            return new NextResponse('ID del documento es requerido', { status: 400 })
        }

        if (!email) {
            return new NextResponse('Email es requerido', { status: 400 })
        }

        // Verificar si el documento existe
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                author: true,
                collaborators: true,
            },
        })

        if (!document) {
            return new NextResponse('Documento no encontrado', { status: 404 })
        }

        // Verificar si el usuario actual es el autor
        if (document.authorId !== session.user.id) {
            return new NextResponse('No tienes permiso para compartir este documento', { status: 403 })
        }

        // Buscar el usuario con quien se quiere compartir
        const userToShare = await prisma.user.findUnique({
            where: { email },
        })

        if (!userToShare) {
            return new NextResponse('Usuario no encontrado', { status: 404 })
        }

        // Verificar que no se esté compartiendo con el autor
        if (userToShare.id === document.authorId) {
            return new NextResponse('No puedes compartir el documento contigo mismo', { status: 400 })
        }

        // Verificar si ya está compartido
        const isAlreadyShared = document.collaborators.some(
            (collaborator) => collaborator.id === userToShare.id
        )

        if (isAlreadyShared) {
            return new NextResponse('El documento ya está compartido con este usuario', { status: 400 })
        }

        // Compartir el documento
        const updatedDocument = await prisma.document.update({
            where: { id: documentId },
            data: {
                collaborators: {
                    connect: { id: userToShare.id },
                },
            },
            include: {
                collaborators: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedDocument)
    } catch (error) {
        console.error('Error sharing document:', error)
        return new NextResponse('Error al compartir el documento', { status: 500 })
    }
}