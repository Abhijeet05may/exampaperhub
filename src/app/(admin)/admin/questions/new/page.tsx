'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import CategorySelector from '@/components/admin/CategorySelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function NewQuestionPage() {
    const [loading, setLoading] = useState(false)
    const [questionText, setQuestionText] = useState('')
    const [options, setOptions] = useState<string[]>(['', '', '', ''])
    const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
    const [explanation, setExplanation] = useState('')
    const [marks, setMarks] = useState(1)
    const [difficulty, setDifficulty] = useState('medium')

    // Category State
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [selectedBook, setSelectedBook] = useState('')
    const [selectedChapter, setSelectedChapter] = useState('')
    const [selectedTopic, setSelectedTopic] = useState('')

    const supabase = createClient()
    const router = useRouter()
    const { toast } = useToast()

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!questionText || !selectedTopic || correctAnswer === null) {
            toast({
                title: "Error",
                description: "Please fill in all required fields (Question, Topic, Correct Answer)",
                variant: "destructive"
            })
            return
        }

        setLoading(true)

        // Upload functionality for images would go here

        const { error } = await supabase.from('questions').insert({
            question_text: questionText,
            options: options,
            correct_answer: options[correctAnswer], // storing the text value as per existing schema
            explanation: explanation,
            marks: marks,
            difficulty: difficulty,
            class_id: selectedClass,
            subject_id: selectedSubject,
            book_id: selectedBook || null,
            chapter_id: selectedChapter,
            topic_id: selectedTopic,
            status: 'pending_review' // Default to pending
        })

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Success",
                description: "Question created successfully and sent for review.",
            })
            router.push('/admin/questions')
        }
        setLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Question</h1>
                <p className="text-muted-foreground">Manually create a multiple choice question.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Categorization */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Categorization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategorySelector
                            onClassChange={setSelectedClass}
                            onSubjectChange={setSelectedSubject}
                            onBookChange={setSelectedBook}
                            onChapterChange={setSelectedChapter}
                            onTopicChange={setSelectedTopic}
                            required
                        />
                    </CardContent>
                </Card>

                {/* 2. Question Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Question Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Question Text</Label>
                            <Textarea
                                placeholder="Enter the question here..."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Marks</Label>
                                <Input
                                    type="number"
                                    value={marks}
                                    onChange={(e) => setMarks(parseInt(e.target.value))}
                                    min={1}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Options & Answer */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Options & Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={correctAnswer === idx}
                                    onChange={() => setCorrectAnswer(idx)}
                                    className="h-4 w-4"
                                />
                                <div className="flex-1 space-y-1">
                                    <Label className="text-xs text-muted-foreground">Option {idx + 1}</Label>
                                    <Input
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        placeholder={`Option ${idx + 1}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 4. Explanation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Explanation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label>Explanation (Optional)</Label>
                            <Textarea
                                placeholder="Explain why the answer is correct..."
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Question
                    </Button>
                </div>
            </form>
        </div>
    )
}
