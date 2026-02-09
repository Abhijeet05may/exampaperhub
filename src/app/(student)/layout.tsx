import { StudentSidebar } from "@/components/layout/StudentSidebar"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/layout/Navbar"

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-muted/30 relative">
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <Navbar /> {/* Student might utilize the main navbar or a specific one, keeping main for now */}
            <div className="flex flex-1">
                <StudentSidebar />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    )
}
