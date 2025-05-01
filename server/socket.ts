import { Server } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function initializeSocket(httpServer: HTTPServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:3001"],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["my-custom-header"],
        },
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
    })

    const connectedUsers = new Map()

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id)

        socket.on('join-document', async ({ documentId, userId }) => {
            socket.join(`document:${documentId}`)
            connectedUsers.set(socket.id, { documentId, userId })

            socket.to(`document:${documentId}`).emit('user-joined', {
                userId,
                socketId: socket.id,
            })
        })

        socket.on('send-message', async ({ documentId, content, userId }) => {
            try {
                const message = await prisma.message.create({
                    data: {
                        content,
                        userId,
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
                })

                // Emitir el mensaje a todos en la sala, incluido el remitente
                io.to(`document:${documentId}`).emit('new-message', message)
            } catch (error) {
                console.error('Error al enviar mensaje:', error)
                socket.emit('error', {
                    type: 'message-error',
                    message: 'Error al enviar el mensaje',
                })
            }
        })

        socket.on('disconnect', () => {
            const userData = connectedUsers.get(socket.id)
            if (userData) {
                const { documentId, userId } = userData
                socket.to(`document:${documentId}`).emit('user-left', {
                    userId,
                    socketId: socket.id,
                })
                connectedUsers.delete(socket.id)
            }
        })
    })

    return io
}