import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden theme-admin bg-muted/40">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
            <Toaster />
        </div>
    )
}
