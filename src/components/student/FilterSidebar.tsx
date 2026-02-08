
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter } from 'lucide-react'

export default function FilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const [classes, setClasses] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [chapters, setChapters] = useState<any[]>([])
    const [topics, setTopics] = useState<any[]>([])

    // State from URL or defaults
    const [selectedClass, setSelectedClass] = useState(searchParams.get('classId') || '')
    const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subjectId') || '')
    const [selectedChapter, setSelectedChapter] = useState(searchParams.get('chapterId') || '')
    const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topicId') || '')
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

    // Load Initial Roots
    useEffect(() => {
        const fetchClasses = async () => {
            const { data } = await supabase.from('classes').select('*').order('name')
            if (data) setClasses(data)
        }
        fetchClasses()
    }, [])

    // Cascading Loads
    useEffect(() => {
        if (!selectedClass) { setSubjects([]); return }
        const fetch = async () => {
            const { data } = await supabase.from('subjects').select('*').eq('class_id', selectedClass).order('name')
            if (data) setSubjects(data)
        }
        fetch()
    }, [selectedClass])

    useEffect(() => {
        if (!selectedSubject) { setChapters([]); return }
        const fetch = async () => {
            const { data } = await supabase.from('chapters').select('*').eq('subject_id', selectedSubject).order('name')
            if (data) setChapters(data)
        }
        fetch()
    }, [selectedSubject])

    useEffect(() => {
        if (!selectedChapter) { setTopics([]); return }
        const fetch = async () => {
            const { data } = await supabase.from('topics').select('*').eq('chapter_id', selectedChapter).order('name')
            if (data) setTopics(data)
        }
        fetch()
    }, [selectedChapter])

    // Update URL on filter change
    const applyFilters = () => {
        const params = new URLSearchParams()
        if (selectedClass) params.set('classId', selectedClass)
        if (selectedSubject) params.set('subjectId', selectedSubject)
        if (selectedChapter) params.set('chapterId', selectedChapter)
        if (selectedTopic) params.set('topicId', selectedTopic)
        if (searchQuery) params.set('q', searchQuery)

        router.push(`/browse?${params.toString()}`)
    }

    // Auto-apply on select change? Or manual button? Manual is better for UX to avoid jumpiness
    // But for sidebar filters, auto-apply is common. Let's do a mix or just a "Apply" button.
    // For now, let's use useEffect to trigger update on selection change to keep it responsive
    // but maybe debounce if needed. Direct update is fine for this scale.

    useEffect(() => {
        // Don't trigger on initial mount unless user interacts? 
        // Actually, standard pattern is to update URL immediately.
        // We need to avoid infinite loops.
        // Let's rely on explicit Apply for now to be safe, or just buttons.
    }, [selectedClass, selectedSubject, selectedChapter, selectedTopic])

    const handleApply = () => {
        applyFilters()
    }

    const handleReset = () => {
        setSelectedClass('')
        setSelectedSubject('')
        setSelectedChapter('')
        setSelectedTopic('')
        setSearchQuery('')
        router.push('/browse')
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border h-fit sticky top-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700 flex items-center">
                    <Filter className="h-4 w-4 mr-2" /> Filters
                </h3>
                <button onClick={handleReset} className="text-xs text-indigo-600 hover:text-indigo-800">
                    Reset
                </button>
            </div>

            <div className="space-y-4">
                {/* Search */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Search</label>
                    <div className="relative mt-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                            placeholder="Search keywords..."
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Search className="h-4 w-4 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setSelectedSubject('');
                                setSelectedChapter('');
                                setSelectedTopic('')
                            }}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setSelectedChapter('');
                                setSelectedTopic('')
                            }}
                            disabled={!selectedClass}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                        >
                            <option value="">All Subjects</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Chapter</label>
                        <select
                            value={selectedChapter}
                            onChange={(e) => {
                                setSelectedChapter(e.target.value);
                                setSelectedTopic('')
                            }}
                            disabled={!selectedSubject}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                        >
                            <option value="">All Chapters</option>
                            {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Topic</label>
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            disabled={!selectedChapter}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                        >
                            <option value="">All Topics</option>
                            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleApply}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    )
}
