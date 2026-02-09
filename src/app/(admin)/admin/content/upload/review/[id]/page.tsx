'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react'

export default function QuestionReviewPage({ params }: { params: { id: string } }) {
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploadDetails, setUploadDetails] = useState<any>(null)

    const router = useRouter()
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        // Get upload details
        const { data: upload } = await supabase
            .from('docx_uploads')
            .select('*')
            .eq('id', params.id)
            .single()

        if (upload) setUploadDetails(upload)

        // Get questions for this upload
        const { data: qs } = await supabase
            .from('questions')
            .select('*')
            .eq('upload_id', params.id)
            .order('id') // Order by insertion

        if (qs) setQuestions(qs)
        setLoading(false)
    }, [params.id, supabase])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleUpdateQuestion = async (index: number, field: string, value: string) => {
        const updatedQuestions = [...questions]
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value, isDirty: true }
        setQuestions(updatedQuestions)
    }

    const handleSaveQuestion = async (index: number) => {
        const q = questions[index]
        const { error } = await supabase
            .from('questions')
            .update({
                question_text: q.question_text,
                explanation: q.explanation,
                status: q.status
            })
            .eq('id', q.id)

        if (!error) {
            const updatedQuestions = [...questions]
            delete updatedQuestions[index].isDirty
            setQuestions(updatedQuestions)
        }
    }

    const handleStatusChange = async (index: number, status: 'approved' | 'rejected') => {
        const updatedQuestions = [...questions]
        updatedQuestions[index].status = status
        setQuestions(updatedQuestions)

        // Auto-save status
        await supabase
            .from('questions')
            .update({ status })
            .eq('id', questions[index].id)
    }

    const handleApproveAll = async () => {
        const { error } = await supabase
            .from('questions')
            .update({ status: 'approved' })
            .eq('upload_id', params.id)

        if (!error) {
            setQuestions(questions.map(q => ({ ...q, status: 'approved' })))

            // Update upload status
            await supabase
                .from('docx_uploads')
                .update({ status: 'approved', reviewed_at: new Date() })
                .eq('id', params.id)

            router.push('/admin/content/upload')
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Review Questions</h1>
                        <p className="text-sm text-muted-foreground">
                            File: {uploadDetails?.filename} • {questions.length} Questions
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/admin/content/upload')}>
                        Cancel
                    </Button>
                    <Button onClick={handleApproveAll} className="bg-green-600 hover:bg-green-700">
                        <Check className="mr-2 h-4 w-4" /> Approve All & Finish
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-6 h-[calc(100vh-8rem)]">

                {/* Left Panel: Document Preview (Mock) */}
                <div className="w-1/2 bg-slate-100 rounded-lg border flex flex-col overflow-hidden">
                    <div className="p-2 border-b bg-white flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Original Document: {uploadDetails?.filename}</span>
                        <Button variant="ghost" size="sm" className="h-6">Zoom In</Button>
                    </div>
                    <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-200/50">
                        {/* Placeholder for PDF/DOCX Viewer */}
                        <div className="w-full max-w-[595px] min-h-[842px] bg-white shadow-lg p-10 space-y-6 select-none opacity-80 pointer-events-none">
                            <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse mb-8" />
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="space-y-2 mb-8">
                                    <div className="h-4 w-full bg-slate-200 rounded" />
                                    <div className="h-4 w-5/6 bg-slate-200 rounded" />
                                    <div className="pl-4 space-y-1 mt-2">
                                        <div className="h-3 w-1/2 bg-slate-100 rounded" />
                                        <div className="h-3 w-1/3 bg-slate-100 rounded" />
                                        <div className="h-3 w-1/3 bg-slate-100 rounded" />
                                        <div className="h-3 w-1/2 bg-slate-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Extracted Questions */}
                <div className="w-1/2 flex flex-col space-y-4 overflow-y-auto pr-2 pb-10">
                    {questions.map((q, index) => (
                        <Card key={q.id} className={`transition-all ${q.status === 'rejected' ? 'opacity-50 bg-red-50' : ''} ${q.status === 'approved' ? 'border-green-200 bg-green-50/30' : ''}`}>
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Q{index + 1}</Badge>
                                    <Badge className={
                                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                            q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                    }>{q.difficulty}</Badge>
                                    {q.status === 'pending_review' && <Badge variant="secondary" className="bg-blue-100 text-blue-700">New</Badge>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant={q.status === 'approved' ? 'default' : 'outline'}
                                        className={q.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                                        onClick={() => handleStatusChange(index, 'approved')}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={q.status === 'rejected' ? 'destructive' : 'outline'}
                                        onClick={() => handleStatusChange(index, 'rejected')}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Question & Options */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Question Stem</label>
                                        <Textarea
                                            value={q.question_text}
                                            onChange={(e) => handleUpdateQuestion(index, 'question_text', e.target.value)}
                                            className="min-h-[80px] font-medium bg-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <div key={opt} className={`flex items-center gap-2 p-2 rounded border ${q.correct_answer === opt ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                                                <span className={`font-bold w-6 h-6 flex items-center justify-center rounded text-xs ${q.correct_answer === opt ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>
                                                    {opt}
                                                </span>
                                                <span className="text-sm truncate flex-1">{q[`option_${opt.toLowerCase()}`]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Metadata & Explanation */}
                                <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground italic">Explanation available</span>
                                        {q.isDirty && (
                                            <Button size="sm" onClick={() => handleSaveQuestion(index)} className="h-7 text-xs">
                                                <Save className="h-3 w-3 mr-1" /> Save
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
