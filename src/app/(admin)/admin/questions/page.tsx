
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { deleteQuestion } from '@/app/(admin)/actions'

export default async function QuestionsPage() {
    const supabase = createClient()

    // Basic fetch, later we can add pagination and filters
    const { data: questions, error } = await supabase
        .from('questions')
        .select(`
        *,
        classes(name),
        subjects(name),
        chapters(name),
        topics(name)
    `)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
                <Link
                    href="/admin/questions/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Question
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Question
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Correct Answer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {!questions || questions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No questions found. Add one to get started.
                                </td>
                            </tr>
                        ) : (
                            questions.map((q: any) => (
                                <tr key={q.id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-2">{q.question_text}</div>
                                        {q.image_url && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                Has Image
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-xs text-gray-500">
                                            {q.classes?.name} &gt; {q.subjects?.name}
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {q.chapters?.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="font-bold text-green-600">{q.correct_answer}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-blue-400 hover:text-blue-600">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <form action={deleteQuestion.bind(null, q.id)}>
                                                <button type="submit" className="text-red-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
