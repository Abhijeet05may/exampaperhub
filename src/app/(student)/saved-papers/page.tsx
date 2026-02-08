
import { createClient } from '@/lib/supabase/server'
import { FileText, Calendar, Hash } from 'lucide-react'

export default async function SavedPapersPage() {
    const supabase = createClient()

    const { data: papers } = await supabase
        .from('saved_papers')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Papers</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!papers || papers.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed text-gray-500">
                        No saved papers found. Create one from the Browse page.
                    </div>
                ) : (
                    papers.map((paper: any) => (
                        <div key={paper.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {paper.title}
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {/* @ts-ignore */}
                                                    {paper.questions?.length || 0} Questions
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm text-gray-500 flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(paper.created_at).toLocaleDateString()}
                                    </div>
                                    {/* Future: Add Actions like Download/Edit */}
                                    <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer">View</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
