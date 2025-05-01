import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Verificar si el usuario es admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (user?.role !== 'ADMIN') {
            return new NextResponse('Forbidden', { status: 403 })
        }

        // Obtener estadísticas
        const [totalUsers, documents] = await Promise.all([
            prisma.user.count(),
            prisma.document.findMany({
                include: {
                    collaborators: true
                }
            })
        ])

        const totalDocuments = documents.length
        const sharedDocuments = documents.filter(doc => doc.collaborators.length > 0).length

        return NextResponse.json({
            totalUsers,
            totalDocuments,
            sharedDocuments
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}