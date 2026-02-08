
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CategorySelectorProps {
    onClassChange?: (id: string) => void
    onSubjectChange?: (id: string) => void
    onChapterChange?: (id: string) => void
    onTopicChange?: (id: string) => void
    required?: boolean
    initialData?: {
        classId?: string
        subjectId?: string
        chapterId?: string
        topicId?: string
    }
}

export default function CategorySelector({
    onClassChange, onSubjectChange, onChapterChange, onTopicChange,
    required = false,
    initialData
}: CategorySelectorProps) {

    const [classes, setClasses] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [chapters, setChapters] = useState<any[]>([])
    const [topics, setTopics] = useState<any[]>([])

    const [selectedClass, setSelectedClass] = useState(initialData?.classId || '')
    const [selectedSubject, setSelectedSubject] = useState(initialData?.subjectId || '')
    const [selectedChapter, setSelectedChapter] = useState(initialData?.chapterId || '')
    const [selectedTopic, setSelectedTopic] = useState(initialData?.topicId || '')

    const supabase = createClient()

    // Load Classes
    useEffect(() => {
        const fetchClasses = async () => {
            const { data } = await supabase.from('classes').select('*').order('name')
            if (data) setClasses(data)
        }
        fetchClasses()
    }, [])

    // Load Subjects when Class changes
    useEffect(() => {
        if (!selectedClass) {
            setSubjects([]);
            // Only reset child selection if it doesn't match the new parent context
            // But for simplicity in this MVP, resetting is safer to avoid invalid states
            if (selectedClass !== initialData?.classId) setSelectedSubject('')
            return
        }
        const fetchSubjects = async () => {
            const { data } = await supabase.from('subjects').select('*').eq('class_id', selectedClass).order('name')
            if (data) setSubjects(data)
        }
        fetchSubjects()
    }, [selectedClass, initialData?.classId])

    // Load Chapters when Subject changes
    useEffect(() => {
        if (!selectedSubject) {
            setChapters([]); setSelectedChapter(''); return
        }
        const fetchChapters = async () => {
            const { data } = await supabase.from('chapters').select('*').eq('subject_id', selectedSubject).order('name')
            if (data) setChapters(data)
        }
        fetchChapters()
    }, [selectedSubject])

    // Load Topics when Chapter changes
    useEffect(() => {
        if (!selectedChapter) {
            setTopics([]); setSelectedTopic(''); return
        }
        const fetchTopics = async () => {
            const { data } = await supabase.from('topics').select('*').eq('chapter_id', selectedChapter).order('name')
            if (data) setTopics(data)
        }
        fetchTopics()
    }, [selectedChapter])


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                    name="class_id"
                    value={selectedClass}
                    onChange={(e) => {
                        const val = e.target.value
                        setSelectedClass(val)
                        onClassChange?.(val)
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    required={required}
                >
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <select
                    name="subject_id"
                    value={selectedSubject}
                    onChange={(e) => {
                        const val = e.target.value
                        setSelectedSubject(val)
                        onSubjectChange?.(val)
                    }}
                    disabled={!selectedClass}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 disabled:bg-gray-100"
                    required={required}
                >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Chapter</label>
                <select
                    name="chapter_id"
                    value={selectedChapter}
                    onChange={(e) => {
                        const val = e.target.value
                        setSelectedChapter(val)
                        onChapterChange?.(val)
                    }}
                    disabled={!selectedSubject}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 disabled:bg-gray-100"
                    required={required}
                >
                    <option value="">Select Chapter</option>
                    {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Topic</label>
                <select
                    name="topic_id"
                    value={selectedTopic}
                    onChange={(e) => {
                        const val = e.target.value
                        setSelectedTopic(val)
                        onTopicChange?.(val)
                    }}
                    disabled={!selectedChapter}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 disabled:bg-gray-100"
                    required={required}
                >
                    <option value="">Select Topic</option>
                    {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
        </div>
    )
}
