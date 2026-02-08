
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
    const supabase = createClient()
    // Fetch Stats
    const { count: questionCount } = await supabase.from('questions').select('*', { count: 'exact', head: true })
    const { count: studentCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'student')
    const { count: paperCount } = await supabase.from('saved_papers').select('*', { count: 'exact', head: true })

    // Fetch Recent Questions
    const { data: recentQuestions } = await supabase
        .from('questions')
        .select('id, question_text, created_at, difficulty, subjects(name)')
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Questions</p>
                            <p className="text-3xl font-bold text-indigo-600">{questionCount || 0}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-full">
                            <span className="text-indigo-600 text-xl font-bold">Q</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Registered Students</p>
                            <p className="text-3xl font-bold text-green-600">{studentCount || 0}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <span className="text-green-600 text-xl font-bold">S</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Papers Generated</p>
                            <p className="text-3xl font-bold text-purple-600">{paperCount || 0}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <span className="text-purple-600 text-xl font-bold">P</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Questions</h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500">
                                    <th className="pb-3 font-medium">Question</th>
                                    <th className="pb-3 font-medium">Subject</th>
                                    <th className="pb-3 font-medium">Difficulty</th>
                                    <th className="pb-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentQuestions?.map((q) => (
                                    <tr key={q.id} className="hover:bg-gray-50">
                                        <td className="py-3 pr-4 max-w-md truncate" title={q.question_text}>
                                            {q.question_text}
                                        </td>
                                        <td className="py-3">
                                            {/* @ts-ignore */}
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{q.subjects?.name || 'N/A'}</span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-500">
                                            {new Date(q.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!recentQuestions || recentQuestions.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-4 text-center text-gray-500">No recent activity</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
