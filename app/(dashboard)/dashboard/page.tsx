'use client'

import { useEffect, useState } from 'react'
import { DocumentList } from '@/components/dashboard/document-list'
import { CreateDocument } from '@/components/dashboard/create-document'
import { useAuth } from '@/hooks/use-auth'
import { Card } from '@/components/ui/card'
import { Users, FileText, Share2, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {NotificationBell} from "@/components/layout/notification-bell";

interface Stats {
    totalUsers: number
    totalDocuments: number
    sharedDocuments: number
}

export default function DashboardPage() {
    const { isAdmin, session } = useAuth()
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalDocuments: 0,
        sharedDocuments: 0,
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            if (!isAdmin) return
            try {
                setIsLoading(true)
                const response = await fetch('/api/stats')
                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas')
                }
                const data = await response.json()
                setStats(data)
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [isAdmin])

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {isAdmin ? 'Panel de administración' : 'Mi espacio de trabajo'}
                    </h1>
                    <Badge variant={isAdmin ? "default" : "secondary"} className="h-6">
                        {isAdmin ? (
                            <><User className="w-3 h-3 mr-1"/>Admin</>
                        ) : (
                            <><User className="w-3 h-3 mr-1"/>Usuario</>
                        )}
                    </Badge>
                </div>
                <CreateDocument/>
                <div className="p-4 flex justify-end">
                    <NotificationBell/>
                </div>
            </div>

            {isAdmin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Usuarios
                                </p>
                                <p className="text-2xl font-bold">
                                    {isLoading ? '...' : stats.totalUsers}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Documentos Creados
                                </p>
                                <p className="text-2xl font-bold">
                                    {isLoading ? '...' : stats.totalDocuments}
                                </p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Documentos Compartidos
                                </p>
                                <p className="text-2xl font-bold">
                                    {isLoading ? '...' : stats.sharedDocuments}
                                </p>
                            </div>
                            <Share2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </Card>
                </div>
            )}

            <div className="space-y-4">
                <Tabs defaultValue="created" className="w-full">
                    <TabsList>
                        <TabsTrigger value="created">Mis documentos</TabsTrigger>
                        <TabsTrigger value="shared">Compartidos conmigo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="created">
                        <DocumentList filter="created" />
                    </TabsContent>
                    <TabsContent value="shared">
                        <DocumentList filter="shared" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}