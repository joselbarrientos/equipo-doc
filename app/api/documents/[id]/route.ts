import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        const documentId = params.id
        const { title, content } = await request.json()

        if (!documentId) {
            return new NextResponse('ID del documento es requerido', { status: 400 })
        }

        // Verify document exists and user has permission
        const existingDocument = await prisma.document.findUnique({
            where: { id: documentId },
            select: { authorId: true }
        })

        if (!existingDocument) {
            return new NextResponse('Documento no encontrado', { status: 404 })
        }

        if (existingDocument.authorId !== session.user.id) {
            return new NextResponse('No tienes permiso para editar este documento', { status: 403 })
        }

        // Update the document
        const updatedDocument = await prisma.document.update({
            where: { id: documentId },
            data: {
                title,
                content: content || '', // Ensure content is never null
                updatedAt: new Date(),
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

        return NextResponse.json(updatedDocument)
    } catch (error) {
        console.error('Error updating document:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        const documentId = params.id
        if (!documentId) {
            return new NextResponse('ID del documento es requerido', { status: 400 })
        }

        const document = await prisma.document.findUnique({
            where: { id: documentId },
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

        if (!document) {
            return new NextResponse('Documento no encontrado', { status: 404 })
        }

        return NextResponse.json(document)
    } catch (error) {
        console.error('Error fetching document:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}