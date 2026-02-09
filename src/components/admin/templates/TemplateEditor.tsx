"use client"

import React, { useState } from 'react'
import {
    Save,
    ArrowLeft,
    Plus,
    Trash2,
    FileText,
    Layout,
    Settings,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

// Types
interface Section {
    id: string
    title: string
    description?: string
    questionCount: number
    marksPerQuestion: number
    type: 'mcq' | 'subjective' | 'mixed'
}

interface TemplateData {
    id: string
    title: string
    type: string
    durationMinutes: number
    totalMarks: number
    sections: Section[]
    instructions: string[]
}

// Mock Initial Data
const initialTemplate: TemplateData = {
    id: 'new',
    title: 'Standard Terminal Exam',
    type: 'terminal',
    durationMinutes: 180,
    totalMarks: 100,
    sections: [
        { id: 's-1', title: 'Section A: Multiple Choice', questionCount: 20, marksPerQuestion: 1, type: 'mcq' },
        { id: 's-2', title: 'Section B: Short Answers', questionCount: 10, marksPerQuestion: 3, type: 'subjective' },
        { id: 's-3', title: 'Section C: Long Answers', questionCount: 5, marksPerQuestion: 10, type: 'subjective' }
    ],
    instructions: [
        'All questions are compulsory.',
        'Draw neat diagrams wherever necessary.',
        'Use of calculator is not allowed.'
    ]
}

export function TemplateEditor({ templateId }: { templateId?: string }) {
    const [template, setTemplate] = useState<TemplateData>(initialTemplate)

    const addSection = () => {
        const newSection: Section = {
            id: `s-${Date.now()}`,
            title: 'New Section',
            questionCount: 5,
            marksPerQuestion: 2,
            type: 'subjective'
        }
        setTemplate(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }))
    }

    const removeSection = (id: string) => {
        setTemplate(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== id)
        }))
    }

    const updateSection = (id: string, field: keyof Section, value: any) => {
        setTemplate(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
        }))
    }

    // Calculate total marks automatically
    const calculatedTotalMarks = template.sections.reduce((acc, curr) => acc + (curr.questionCount * curr.marksPerQuestion), 0)

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
            {/* Header */}
            <div className="h-14 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/templates">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <Input
                            value={template.title}
                            onChange={(e) => setTemplate(prev => ({ ...prev, title: e.target.value }))}
                            className="h-8 font-semibold text-sm border-transparent hover:border-input focus:border-input px-2 -ml-2 w-[300px]"
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{template.type.charAt(0).toUpperCase() + template.type.slice(1)} Exam</span>
                            <span>•</span>
                            <span>{calculatedTotalMarks} Marks</span>
                            <span>•</span>
                            <span>{template.durationMinutes} Mins</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                    <Button size="sm">
                        <Save className="mr-2 h-4 w-4" /> Save Template
                    </Button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 min-h-0">
                <ResizablePanelGroup direction="horizontal">
                    {/* Left: Configuration */}
                    <ResizablePanel defaultSize={50} minSize={30} className="bg-white">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-8">

                                {/* General Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">General Settings</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Exam Type</Label>
                                            <Select value={template.type} onValueChange={(v) => setTemplate(prev => ({ ...prev, type: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="terminal">Terminal Exam</SelectItem>
                                                    <SelectItem value="weekly">Weekly Test</SelectItem>
                                                    <SelectItem value="entrance">Entrance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Duration (Minutes)</Label>
                                            <Input
                                                type="number"
                                                value={template.durationMinutes}
                                                onChange={(e) => setTemplate(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Sections Configuration */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Layout className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sections Layout</h3>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={addSection}>
                                            <Plus className="mr-2 h-4 w-4" /> Add Section
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {template.sections.map((section, index) => (
                                            <Card key={section.id} className="relative group">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                                                    onClick={() => removeSection(section.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium">
                                                        <Input
                                                            value={section.title}
                                                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                                            className="h-8 -ml-2 font-semibold border-transparent hover:border-input focus:border-input"
                                                        />
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="grid gap-1.5">
                                                            <Label className="text-xs">Type</Label>
                                                            <Select
                                                                value={section.type}
                                                                onValueChange={(v) => updateSection(section.id, 'type', v)}
                                                            >
                                                                <SelectTrigger className="h-8">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="mcq">MCQ</SelectItem>
                                                                    <SelectItem value="subjective">Subjective</SelectItem>
                                                                    <SelectItem value="mixed">Mixed</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid gap-1.5">
                                                            <Label className="text-xs">Questions</Label>
                                                            <Input
                                                                type="number"
                                                                className="h-8"
                                                                value={section.questionCount}
                                                                onChange={(e) => updateSection(section.id, 'questionCount', parseInt(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-1.5">
                                                            <Label className="text-xs">Marks / Q</Label>
                                                            <Input
                                                                type="number"
                                                                className="h-8"
                                                                value={section.marksPerQuestion}
                                                                onChange={(e) => updateSection(section.id, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-xs text-right text-muted-foreground">
                                                        Section Total: <span className="font-medium text-foreground">{section.questionCount * section.marksPerQuestion} Marks</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Right: Live Preview */}
                    <ResizablePanel defaultSize={50} minSize={30} className="bg-slate-100">
                        <div className="h-full flex flex-col p-8 items-center justify-center overflow-auto">
                            <div className="bg-white shadow-xl w-full max-w-[595px] min-h-[842px] p-12 flex flex-col text-xs leading-relaxed text-slate-800 relative select-none scale-90 origin-top">
                                {/* Preview Overlay */}
                                <div className="absolute top-0 right-0 p-2 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wider rounded-bl-md">
                                    Preview Mode
                                </div>

                                {/* Header */}
                                <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
                                    <h1 className="text-xl font-bold uppercase mb-1">Institution Name</h1>
                                    <h2 className="text-lg font-semibold mb-2">{template.title}</h2>
                                    <div className="flex justify-between font-medium mt-4">
                                        <span>Time: {template.durationMinutes} Mins</span>
                                        <span>Max Marks: {calculatedTotalMarks}</span>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="mb-6">
                                    <h3 className="font-bold mb-2">General Instructions:</h3>
                                    <ol className="list-decimal pl-4 space-y-1">
                                        {template.instructions.map((inst, i) => (
                                            <li key={i}>{inst}</li>
                                        ))}
                                    </ol>
                                </div>

                                {/* Sections Preview */}
                                <div className="space-y-6">
                                    {template.sections.map((section, idx) => (
                                        <div key={section.id}>
                                            <div className="flex justify-between items-baseline mb-4 font-bold border-b border-dashed border-slate-300 pb-1">
                                                <h3 className="uppercase">{section.title}</h3>
                                                <span>({section.questionCount} × {section.marksPerQuestion} = {section.questionCount * section.marksPerQuestion} Marks)</span>
                                            </div>

                                            <div className="space-y-3 opacity-60">
                                                {[1, 2].map((q) => (
                                                    <div key={q} className="flex gap-2">
                                                        <span className="font-medium">Q{q}.</span>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="h-2 bg-slate-200 rounded w-full"></div>
                                                            <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                                                            {section.type === 'mcq' && (
                                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                                    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                                                                    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                                                                    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                                                                    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-[10px]">[{section.marksPerQuestion}]</span>
                                                    </div>
                                                ))}
                                                {section.questionCount > 2 && (
                                                    <div className="text-center italic text-slate-400 py-2">
                                                        ... {section.questionCount - 2} more questions ...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
