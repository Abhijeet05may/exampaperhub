'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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

    useEffect(() => {
        const fetchData = async () => {
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
        }
        fetchData()
    }, [params.id])

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

            router.push('/admin/upload')
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
                    <Button variant="outline" onClick={() => router.push('/admin/upload')}>
                        Cancel
                    </Button>
                    <Button onClick={handleApproveAll} className="bg-green-600 hover:bg-green-700">
                        <Check className="mr-2 h-4 w-4" /> Approve All & Finish
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {questions.map((q, index) => (
                    <Card key={q.id} className={`transition-all ${q.status === 'rejected' ? 'opacity-50 bg-red-50' : ''}`}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">Q{index + 1}</Badge>
                                <Badge className={
                                    q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                        q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                }>{q.difficulty}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={q.status === 'approved' ? 'default' : 'outline'}
                                    className={q.status === 'approved' ? 'bg-green-600' : ''}
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
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            {/* Question & Options */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Question Text</label>
                                    <Textarea
                                        value={q.question_text}
                                        onChange={(e) => handleUpdateQuestion(index, 'question_text', e.target.value)}
                                        className="min-h-[100px] font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {['A', 'B', 'C', 'D'].map(opt => (
                                        <div key={opt} className={`flex items-center gap-2 p-2 rounded border ${q.correct_answer === opt ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                                            <span className={`font-bold w-6 h-6 flex items-center justify-center rounded text-xs ${q.correct_answer === opt ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>
                                                {opt}
                                            </span>
                                            <span className="text-sm">{q[`option_${opt.toLowerCase()}`]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Metadata & Explanation */}
                            <div className="space-y-4">
                                {q.image_url && (
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                        <img src={q.image_url} alt="Question Diagram" className="object-contain w-full h-full" />
                                        <Badge className="absolute top-2 right-2 bg-blue-500">
                                            <ImageIcon className="h-3 w-3 mr-1" /> Image
                                        </Badge>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Explanation</label>
                                    <Textarea
                                        value={q.explanation || ''}
                                        onChange={(e) => handleUpdateQuestion(index, 'explanation', e.target.value)}
                                        className="min-h-[80px] text-sm text-gray-600"
                                        placeholder="No explanation provided"
                                    />
                                </div>
                                {q.isDirty && (
                                    <Button size="sm" onClick={() => handleSaveQuestion(index)} className="w-full">
                                        <Save className="h-4 w-4 mr-2" /> Save Changes
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
