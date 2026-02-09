"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    Save,
    Trash2,
    Copy,
    Move,
    History
} from 'lucide-react'
import { CurriculumNode } from './CurriculumTree'

interface EntityDetailsProps {
    node?: CurriculumNode | null
    onSave?: (node: CurriculumNode) => void
    onDelete?: (id: string) => void
}

export function EntityDetails({ node, onSave, onDelete }: EntityDetailsProps) {
    if (!node) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="p-4 rounded-full bg-slate-50 mb-4">
                    <Move className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium">Select an item</h3>
                <p className="text-sm">Choose a curriculum entity from the tree to view details.</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-start bg-slate-50/50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                            {node.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">ID: {node.id.substring(0, 8)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{node.title}</h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <History className="mr-2 h-4 w-4" /> Log
                    </Button>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">General Information</h3>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" defaultValue={node.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug / Code</Label>
                        <Input id="slug" defaultValue={node.metadata?.code || node.title.toLowerCase().replace(/\s+/g, '-')} className="font-mono text-sm" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Add a brief description..." className="min-h-[100px]" />
                    </div>
                </div>

                <Separator />

                {/* Statistics */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border bg-slate-50">
                            <span className="text-xs text-muted-foreground">Total Questions</span>
                            <div className="text-2xl font-bold">{node.metadata?.questionsCount || 0}</div>
                        </div>
                        <div className="p-4 rounded-lg border bg-slate-50">
                            <span className="text-xs text-muted-foreground">Sub-items</span>
                            <div className="text-2xl font-bold">{node.children?.length || 0}</div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Settings */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Settings</h3>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="space-y-0.5">
                            <Label>Active Status</Label>
                            <p className="text-xs text-muted-foreground">Visible to students and content creators</p>
                        </div>
                        {/* Add Switch here */}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>
        </div>
    )
}
