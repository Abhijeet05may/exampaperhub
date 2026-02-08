
import { Suspense } from 'react'
import FilterSidebar from '@/components/student/FilterSidebar'
import QuestionList from '@/components/student/QuestionList'
import { createClient } from '@/lib/supabase/server'

interface BrowsePageProps {
    searchParams: {
        classId?: string
        subjectId?: string
        chapterId?: string
        topicId?: string
        q?: string
    }
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
    const supabase = createClient()
    let query = supabase.from('questions').select(`
    *,
    classes(name),
    subjects(name),
    chapters(name),
    topics(name)
  `)

    if (searchParams.classId) query = query.eq('class_id', searchParams.classId)
    if (searchParams.subjectId) query = query.eq('subject_id', searchParams.subjectId)
    if (searchParams.chapterId) query = query.eq('chapter_id', searchParams.chapterId)
    if (searchParams.topicId) query = query.eq('topic_id', searchParams.topicId)
    if (searchParams.q) query = query.ilike('question_text', `%${searchParams.q}%`)

    const { data: questions } = await query.order('created_at', { ascending: false }).limit(100)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <FilterSidebar />
                    </Suspense>
                </div>
                <div className="md:col-span-3">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Questions</h1>
                    <Suspense fallback={<div>Loading questions...</div>}>
                        {/* Pass simple array, ensure types match or use any for MVP speed */}
                        <QuestionList initialQuestions={questions || []} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
