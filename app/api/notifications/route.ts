import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        const { recipientId, documentId, message } = await request.json()

        const notification = await prisma.notification.create({
            data: {
                recipientId,
                documentId,
                message,
                read: false,
            },
        })

        return NextResponse.json(notification)
    } catch (error) {
        console.error('Error creating notification:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('No autorizado', { status: 401 })
        }

        const notifications = await prisma.notification.findMany({
            where: {
                recipientId: session.user.id,
                read: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(notifications)
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return new NextResponse('Error interno del servidor', { status: 500 })
    }
}