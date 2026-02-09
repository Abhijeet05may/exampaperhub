
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CategorySelectorProps {
    onClassChange?: (id: string) => void
    onSubjectChange?: (id: string) => void
    onBookChange?: (id: string) => void
    onChapterChange?: (id: string) => void
    onTopicChange?: (id: string) => void
    required?: boolean
    initialData?: {
        classId?: string
        subjectId?: string
        bookId?: string
        chapterId?: string
        topicId?: string
    }
}

export default function CategorySelector({
    onClassChange, onSubjectChange, onBookChange, onChapterChange, onTopicChange,
    required = false,
    initialData
}: CategorySelectorProps) {

    const [classes, setClasses] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [books, setBooks] = useState<any[]>([])
    const [chapters, setChapters] = useState<any[]>([])
    const [topics, setTopics] = useState<any[]>([])

    const [selectedClass, setSelectedClass] = useState(initialData?.classId || '')
    const [selectedSubject, setSelectedSubject] = useState(initialData?.subjectId || '')
    const [selectedBook, setSelectedBook] = useState(initialData?.bookId || '')
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
            setSubjects([]); setSelectedSubject('');
            setBooks([]); setSelectedBook('');
            setChapters([]); setSelectedChapter('');
            setTopics([]); setSelectedTopic('');
            return
        }
        const fetchSubjects = async () => {
            const { data } = await supabase.from('subjects').select('*').eq('class_id', selectedClass).order('name')
            if (data) setSubjects(data)
        }
        fetchSubjects()
    }, [selectedClass])

    // Load Books when Subject changes
    useEffect(() => {
        if (!selectedSubject) {
            setBooks([]); setSelectedBook('');
            setChapters([]); setSelectedChapter('');
            setTopics([]); setSelectedTopic('');
            return
        }
        const fetchBooks = async () => {
            const { data } = await supabase.from('books').select('*').eq('subject_id', selectedSubject).order('name')
            if (data) setBooks(data)
        }
        fetchBooks()

        // Also fetch chapters directly linked to subject (if any, or if we want to show mixed list)
        // For now, let's assume if books exist, user should select one. If not, maybe direct chapters?
        // To simplify: clear chapters when subject changes, wait for book selection OR if no books, maybe fetch subject chapters?
        // Let's stick to the hierarchy: Subject -> Book (optional) -> Chapter
        // If we want optional book, we need to handle that. 
        // Let's fetch chapters for the subject regardless, but if a book is selected, filter by it?
        // Actually, chapters are now either linked to book OR subject. 
        // Let's fetch chapters that are directly linked to subject if no book selected?
        // For simplicity in this UI, let's allow selecting a book.

        const fetchChaptersDirect = async () => {
            // Fetch chapters that belong to this subject (and optionally have no book_id if we want strict separation)
            // But the migration didn't enforce book_id.
            const { data } = await supabase.from('chapters').select('*').eq('subject_id', selectedSubject).is('book_id', null).order('name')
            if (data) setChapters(data)
        }
        fetchChaptersDirect()

    }, [selectedSubject])

    // Load Chapters when Book changes
    useEffect(() => {
        if (!selectedBook) {
            // If desected book, maybe go back to subject chapters? 
            // relying on the subject effect to handle 'no book' state might be tricky if we don't trigger it.
            // But here we can fetch chapters for either book or subject.
            return
        }
        const fetchChapters = async () => {
            const { data } = await supabase.from('chapters').select('*').eq('book_id', selectedBook).order('name')
            if (data) setChapters(data)
        }
        fetchChapters()
    }, [selectedBook])

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <label className="block text-sm font-medium text-gray-700">Book (Optional)</label>
                <select
                    name="book_id"
                    value={selectedBook}
                    onChange={(e) => {
                        const val = e.target.value
                        setSelectedBook(val)
                        onBookChange?.(val)
                    }}
                    disabled={!selectedSubject}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 disabled:bg-gray-100"
                >
                    <option value="">Select Book</option>
                    {books.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
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
