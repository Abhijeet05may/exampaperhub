import { Suspense } from 'react'
import FilterSidebar from '@/components/student/FilterSidebar'
import QuestionList from '@/components/student/QuestionList'
import BucketSidebar from '@/components/student/BucketSidebar'
import { createClient } from '@/lib/supabase/server'
import { Separator } from "@/components/ui/separator"

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
        <div className="container py-8 max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-8 lg:space-y-0">
                {/* Left: Filters */}
                <aside className="w-full lg:w-1/5 order-2 lg:order-1">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <FilterSidebar />
                    </Suspense>
                </aside>

                {/* Middle: Questions */}
                <div className="flex-1 order-3 lg:order-2">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">Browse Questions</h1>
                        <p className="text-muted-foreground">
                            Explore and filter questions to build your exam paper.
                        </p>
                    </div>
                    <Separator className="my-6" />
                    <Suspense fallback={<div>Loading questions...</div>}>
                        <QuestionList initialQuestions={questions || []} />
                    </Suspense>
                </div>

                {/* Right: Bucket */}
                <aside className="w-full lg:w-1/4 order-1 lg:order-3">
                    <BucketSidebar />
                </aside>
            </div>
        </div>
    )
}
