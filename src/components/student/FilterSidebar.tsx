
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

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
        <Card className="sticky top-4 border-none shadow-lg bg-white/80 backdrop-blur-md">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" /> Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2 text-xs hover:text-primary">
                        <RotateCcw className="h-3 w-3 mr-1" /> Reset
                    </Button>
                </div>
                <Separator className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Search</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                            placeholder="Keywords..."
                            className="pl-9"
                        />
                        <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Class</Label>
                        <Select value={selectedClass} onValueChange={(val) => {
                            setSelectedClass(val);
                            setSelectedSubject('');
                            setSelectedChapter('');
                            setSelectedTopic('')
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Subject</Label>
                        <Select value={selectedSubject} disabled={!selectedClass} onValueChange={(val) => {
                            setSelectedSubject(val);
                            setSelectedChapter('');
                            setSelectedTopic('')
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Chapter</Label>
                        <Select value={selectedChapter} disabled={!selectedSubject} onValueChange={(val) => {
                            setSelectedChapter(val);
                            setSelectedTopic('')
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Chapters" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Chapters</SelectItem>
                                {chapters.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Topic</Label>
                        <Select value={selectedTopic} disabled={!selectedChapter} onValueChange={setSelectedTopic}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Topics" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Topics</SelectItem>
                                {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={handleApply} className="w-full font-semibold shadow-md">
                    Apply Filters
                </Button>
            </CardContent>
        </Card>
    )
}


