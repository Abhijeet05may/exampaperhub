
import BucketSidebar from '@/components/student/BucketSidebar'
import Link from 'next/link'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/browse" className="text-xl font-bold text-indigo-600">
                            ExamPaperHub
                        </Link>
                        <nav className="ml-10 space-x-4 hidden md:block">
                            <Link href="/browse" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                Browse Questions
                            </Link>
                            <Link href="/saved-papers" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                Saved Papers
                            </Link>
                        </nav>
                    </div>
                    <div>
                        {/* User Profile / Logout would go here */}
                    </div>
                </div>
            </header>

            <main>
                {children}
            </main>

            <BucketSidebar />
        </div>
    )
}
