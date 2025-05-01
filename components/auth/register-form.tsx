'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { Eye, EyeOff, Check, X } from 'lucide-react'

export function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordStrength, setPasswordStrength] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        isLongEnough: false,
    })

    useEffect(() => {
        setPasswordStrength({
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*]/.test(password),
            isLongEnough: password.length >= 8,
        })
    }, [password])

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const name = formData.get('name') as string

        if (!Object.values(passwordStrength).every(Boolean)) {
            setError('La contraseña no cumple con todos los requisitos')
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Error al registrar usuario')
            }

            router.push('/login?registered=true')
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Crear cuenta</CardTitle>
                <CardDescription>
                    Regístrate para comenzar a crear documentos y roadmaps
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <div className="space-y-1 mt-2">
                            <PasswordRequirement met={passwordStrength.isLongEnough}>
                                Al menos 8 caracteres
                            </PasswordRequirement>
                            <PasswordRequirement met={passwordStrength.hasUppercase}>
                                Al menos una mayúscula
                            </PasswordRequirement>
                            <PasswordRequirement met={passwordStrength.hasLowercase}>
                                Al menos una minúscula
                            </PasswordRequirement>
                            <PasswordRequirement met={passwordStrength.hasNumber}>
                                Al menos un número
                            </PasswordRequirement>
                            <PasswordRequirement met={passwordStrength.hasSpecialChar}>
                                Al menos un carácter especial (!@#$%^&*)
                            </PasswordRequirement>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading || !Object.values(passwordStrength).every(Boolean)}>
                        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}

function PasswordRequirement({ children, met }: { children: React.ReactNode; met: boolean }) {
    return (
        <div className={`text-sm flex items-center ${met ? 'text-green-600' : 'text-red-600'}`}>
            {met ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
            {children}
        </div>
    )
}