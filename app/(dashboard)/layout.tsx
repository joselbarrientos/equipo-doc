import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-muted/50">
                {children}
            </main>
        </div>
    )
}