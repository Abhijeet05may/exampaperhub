
import Link from 'next/link'
import { FileText, CheckCircle, BarChart } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <FileText className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">ExamPaperHub</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                                Log in
                            </Link>
                            <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Effortless Exam Paper</span>
                            <span className="block text-indigo-600">Generation for Educators</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Streamline your assessment process. Access a vast bank of questions, customize exam papers, and generate PDFs in minutes.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            <div className="rounded-md shadow">
                                <Link href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                    Get Started
                                </Link>
                            </div>
                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                    Live Demo
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Vast Question Bank</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Access thousands of questions across various subjects, chapters, and difficulty levels. Upload your own via DOCX.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Selection</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Browse, filter, and cherry-pick questions. Add them to your bucket and organize your paper structure intuitively.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                        <BarChart className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Instant PDF Export</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Generate professional-quality PDF exam papers and answer keys with a single click. Save templates for future use.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-gray-400">
                            &copy; {new Date().getFullYear()} ExamPaperHub. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
