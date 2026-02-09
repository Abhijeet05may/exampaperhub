"use client"

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { CurriculumTree, CurriculumNode } from '@/components/admin/curriculum/CurriculumTree'
import { EntityDetails } from '@/components/admin/curriculum/EntityDetails'

// Mock Data
const initialData: CurriculumNode[] = [
    {
        id: 'c-1',
        title: 'Class 10',
        type: 'class',
        metadata: { questionsCount: 1240 },
        children: [
            {
                id: 's-1',
                title: 'Mathematics',
                type: 'subject',
                metadata: { questionsCount: 500, code: 'MATH10' },
                children: [
                    {
                        id: 'ch-1',
                        title: 'Real Numbers',
                        type: 'chapter',
                        metadata: { questionsCount: 120 },
                        children: [
                            { id: 't-1', title: 'Euclid Division Lemma', type: 'topic', metadata: { questionsCount: 40 } },
                            { id: 't-2', title: 'Fundamental Theorem of Arithmetic', type: 'topic', metadata: { questionsCount: 80 } }
                        ]
                    },
                    {
                        id: 'ch-2',
                        title: 'Polynomials',
                        type: 'chapter',
                        metadata: { questionsCount: 380 },
                        children: []
                    }
                ]
            },
            {
                id: 's-2',
                title: 'Science',
                type: 'subject',
                metadata: { questionsCount: 740, code: 'SCI10' },
                children: []
            }
        ]
    },
    {
        id: 'c-2',
        title: 'Class 12',
        type: 'class',
        metadata: { questionsCount: 890 },
        children: []
    }
]

export default function CurriculumPage() {
    const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(null)

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex-none px-6 py-4 border-b flex justify-between items-center bg-white">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Curriculum Manager</h1>
                    <p className="text-muted-foreground">Manage hierarchy for classes, subjects, and topics.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Import Structure</Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Root Item
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="bg-white">
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b bg-slate-50/50">
                                <input
                                    type="text"
                                    placeholder="Search hierarchy..."
                                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto px-2">
                                <CurriculumTree
                                    data={initialData}
                                    onSelect={setSelectedNode}
                                    selectedId={selectedNode?.id}
                                />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-slate-50/30">
                            <EntityDetails node={selectedNode} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
