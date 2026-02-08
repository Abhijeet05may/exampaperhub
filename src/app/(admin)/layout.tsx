
import Link from 'next/link'
import { LayoutDashboard, Layers, FileText, Upload, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check role
    const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

    if (!userRole || userRole.role !== 'admin') {
        redirect('/') // Redirect non-admins to home
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="flex h-16 items-center justify-center border-b">
                    <span className="text-xl font-bold text-gray-800">ExamPaperHub</span>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        <Layers className="mr-3 h-5 w-5" />
                        Categories
                    </Link>
                    <Link
                        href="/admin/questions"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        <FileText className="mr-3 h-5 w-5" />
                        Questions
                    </Link>
                    <Link
                        href="/admin/upload"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        <Upload className="mr-3 h-5 w-5" />
                        Upload DOCX
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <form action="/auth/signout" method="post">
                        <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md">
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="flex items-center justify-between h-16 bg-white shadow-sm px-6">
                    <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{user.email}</span>
                    </div>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
