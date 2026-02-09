"use client"

import React, { useState } from 'react'
import {
    Save,
    ArrowLeft,
    Eye,
    MoreHorizontal,
    Plus,
    Trash2,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { QuestionMetadata } from './QuestionMetadata'
import Link from 'next/link'

// Mock Initial Data
const initialQuestion = {
    id: 'q-new',
    status: 'draft',
    content: '<p>What is the value of x in the equation 2x + 5 = 15?</p>',
    options: [
        { id: 'opt-1', content: '5', isCorrect: true },
        { id: 'opt-2', content: '10', isCorrect: false },
        { id: 'opt-3', content: '7.5', isCorrect: false },
        { id: 'opt-4', content: '2.5', isCorrect: false },
    ],
    explanation: '<p>Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5.</p>',
    metadata: {
        classId: '',
        subjectId: '',
        chapterId: '',
        topicId: '',
        difficulty: 'medium',
        type: 'mcq',
        marks: 1,
        negativeMarks: 0.25,
        tags: ['algebra', 'linear-equations']
    }
}

export function QuestionEditor({ questionId }: { questionId: string }) {
    const [question, setQuestion] = useState(initialQuestion)
    const [saving, setSaving] = useState(false)

    const handleMetadataChange = (field: string, value: any) => {
        setQuestion(prev => ({
            ...prev,
            metadata: { ...prev.metadata, [field]: value }
        }))
    }

    const handleOptionChange = (id: string, content: string) => {
        setQuestion(prev => ({
            ...prev,
            options: prev.options.map(opt => opt.id === id ? { ...opt, content } : opt)
        }))
    }

    const toggleCorrectOption = (id: string) => {
        setQuestion(prev => ({
            ...prev,
            options: prev.options.map(opt => ({
                ...opt,
                isCorrect: opt.id === id // Only one correct for MCQ
            }))
        }))
    }

    const addOption = () => {
        const newId = `opt-${Date.now()}`
        setQuestion(prev => ({
            ...prev,
            options: [...prev.options, { id: newId, content: 'New Option', isCorrect: false }]
        }))
    }

    const removeOption = (id: string) => {
        setQuestion(prev => ({
            ...prev,
            options: prev.options.filter(opt => opt.id !== id)
        }))
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
            {/* Header */}
            <div className="h-14 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/content/questions">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">Question {questionId}</span>
                            <Badge variant="secondary" className="uppercase text-[10px]">{question.status}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">Last saved 2 mins ago</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="outline" size="sm">
                        Save Draft
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="mr-2 h-4 w-4" /> Publish
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600">Delete Question</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 min-h-0">
                <ResizablePanelGroup direction="horizontal">
                    {/* Left: Editor */}
                    <ResizablePanel defaultSize={70} minSize={50} className="bg-white">
                        <div className="h-full overflow-y-auto p-8 max-w-4xl mx-auto space-y-8">

                            {/* Question Stem */}
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Question Content</Label>
                                <RichTextEditor
                                    value={question.content}
                                    onChange={(val) => setQuestion(prev => ({ ...prev, content: val }))}
                                />
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Options</Label>
                                    <Button variant="outline" size="sm" onClick={addOption}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Option
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {question.options.map((opt, index) => (
                                        <div key={opt.id} className="flex gap-4 items-start p-4 rounded-lg border bg-slate-50/50">
                                            <div className="pt-2">
                                                <div
                                                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${opt.isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-slate-400'}`}
                                                    onClick={() => toggleCorrectOption(opt.id)}
                                                >
                                                    {opt.isCorrect && <div className="h-3 w-3 rounded-full bg-emerald-500" />}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-muted-foreground uppercase">Option {String.fromCharCode(65 + index)}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => removeOption(opt.id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                {/* Simplified Editor for Options */}
                                                <Input
                                                    value={opt.content}
                                                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                                                    className="bg-white"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Explanation</Label>
                                <RichTextEditor
                                    value={question.explanation}
                                    onChange={(val) => setQuestion(prev => ({ ...prev, explanation: val }))}
                                />
                            </div>

                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Right: Metadata */}
                    <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="bg-slate-50">
                        <div className="h-full overflow-y-auto p-6 border-l">
                            <QuestionMetadata
                                data={question.metadata}
                                onChange={handleMetadataChange}
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
