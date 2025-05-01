import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "El email ya está registrado" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
        })
    } catch (error) {
        return NextResponse.json(
            { error: "Error al crear el usuario" },
            { status: 500 }
        )
    }
}