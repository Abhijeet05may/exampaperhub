'use client'

import { usePaperBucket } from '@/hooks/usePaperBucket'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, FileText, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function PaperPage() {
    const { questions, removeQuestion, reorderQuestions } = usePaperBucket()
    const [paperTitle, setPaperTitle] = useState('Untitled Exam Paper')
    const [generating, setGenerating] = useState(false)
    const supabase = createClient()

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return
        }
        reorderQuestions(result.source.index, result.destination.index)
    }

    const handleGeneratePDF = async (type: 'paper' | 'solution') => {
        if (questions.length === 0) return
        setGenerating(true)

        try {
            const { data, error } = await supabase.functions.invoke('generate-pdf', {
                body: {
                    questions,
                    title: paperTitle,
                    type // 'paper' or 'solution'
                }
            })

            if (error) throw error

            // TODO: Handle PDF download trigger from response
            // For now, let's assume the function returns a URL or blob
            alert(`PDF Generation simulated for ${type}. (Edge function needs implementation)`)

        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Failed to generate PDF')
        } finally {
            setGenerating(false)
        }
    }

    if (questions.length === 0) {
        return (
            <div className="container py-12 max-w-4xl mx-auto text-center">
                <div className="bg-muted/30 rounded-lg border-2 border-dashed p-12">
                    <h2 className="text-2xl font-bold mb-4">Your paper is empty</h2>
                    <p className="text-muted-foreground mb-8">Go back to the browser to add questions.</p>
                    <Link href="/browse">
                        <Button>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Browse Questions
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/browse" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Paper Review</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Paper Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Paper Title</Label>
                                <Input
                                    value={paperTitle}
                                    onChange={(e) => setPaperTitle(e.target.value)}
                                    className="text-lg font-medium"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center justify-between">
                            Questions ({questions.length})
                            <span className="text-sm font-normal text-muted-foreground">Drag to reorder</span>
                        </h2>

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="questions-list">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-4"
                                    >
                                        {questions.map((q, index) => (
                                            <Draggable key={q.id} draggableId={q.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`bg-white border rounded-lg p-4 transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : 'shadow-sm'}`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="flex flex-col items-center justify-center text-muted-foreground cursor-grab active:cursor-grabbing px-1"
                                                            >
                                                                <span className="text-xs font-bold mb-1">{index + 1}</span>
                                                                <GripVertical className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex justify-between">
                                                                    <div className="space-y-1">
                                                                        <p className="font-medium text-lg">{q.question_text}</p>
                                                                        <div className="flex gap-2">
                                                                            <Badge variant="outline">{q.difficulty}</Badge>
                                                                            <Badge variant="secondary">{q.topics?.name}</Badge>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => removeQuestion(q.id)}
                                                                        className="text-muted-foreground hover:text-destructive"
                                                                    >
                                                                        <Trash2 className="h-5 w-5" />
                                                                    </Button>
                                                                </div>
                                                                {q.image_url && (
                                                                    <div className="mt-2 text-xs text-muted-foreground bg-muted inline-block px-2 py-1 rounded">
                                                                        Contains Image
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => handleGeneratePDF('paper')}
                                disabled={generating}
                            >
                                <FileText className="mr-2 h-4 w-4" /> Download Paper
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                size="lg"
                                onClick={() => handleGeneratePDF('solution')}
                                disabled={generating}
                            >
                                <Download className="mr-2 h-4 w-4" /> Download Solutions
                            </Button>

                            <Separator />

                            <div className="text-sm text-muted-foreground space-y-2">
                                <p>Total Marks: {questions.length} x 1 = {questions.length}</p>
                                <p>Time: ~{Math.ceil(questions.length * 1.2)} mins</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
