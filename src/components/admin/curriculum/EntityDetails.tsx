"use client"

import { CurriculumNode } from "./types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Calendar,
    Trash2,
    Save,
    AlertTriangle,
    Clock,
    User,
    Shield
} from "lucide-react"

interface EntityDetailsProps {
    node: CurriculumNode | null
    onAction?: (action: string, node: CurriculumNode, data?: any) => void
}

export function EntityDetails({ node, onAction }: EntityDetailsProps) {
    if (!node) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-slate-300" />
                </div>
                <h3 className="font-medium text-slate-900">No Selection</h3>
                <p className="text-sm mt-1">Select an item from the tree to view its details and governance.</p>
            </div>
        )
    }

    const hasDependencies = (node.children && node.children.length > 0) || (node.metadata?.questionsCount && node.metadata.questionsCount > 0)

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-6 pb-20">
                {/* Header with Type and Last Updated */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize px-2 py-0.5 text-xs font-normal text-muted-foreground bg-slate-50">
                            {node.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {node.metadata?.lastUpdated ? new Date(node.metadata.lastUpdated).toLocaleDateString() : 'Just now'}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">{node.title}</h2>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className={`h-2 w-2 rounded-full ${node.metadata?.status === 'draft' ? 'bg-amber-400' : node.metadata?.status === 'archived' ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                            <span className="capitalize">{node.metadata?.status || 'Active'}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px] opacity-70">ID: {node.id.slice(0, 8)}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase">Name</Label>
                        <Input id="title" defaultValue={node.title} className="font-medium" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="slug" className="text-xs font-medium text-muted-foreground uppercase">Code / Slug</Label>
                        <Input id="slug" defaultValue={node.metadata?.code || node.title.toLowerCase().replace(/\s+/g, '-')} className="font-mono text-sm bg-slate-50" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase">Description</Label>
                        <Textarea id="description" defaultValue={node.metadata?.description || ''} className="resize-none min-h-[80px]" placeholder="Add a description..." />
                    </div>
                    <div className="flex justify-end">
                        <Button size="sm" onClick={() => onAction?.('save', node)}>
                            <Save className="h-3.5 w-3.5 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Statistics & Governance */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                            Statistics
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <div className="text-2xl font-bold text-slate-700">{node.metadata?.questionsCount || 0}</div>
                                <div className="text-xs text-muted-foreground font-medium">Total Questions</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <div className="text-2xl font-bold text-slate-700">{node.children?.length || 0}</div>
                                <div className="text-xs text-muted-foreground font-medium">Sub-items</div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2">
                            Governance
                        </h4>
                        <div className="text-sm space-y-3 p-3 border border-slate-100 rounded bg-slate-50/50">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Created By</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium">
                                    <User className="h-3 w-3" /> Admin
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Owner</span>
                                <span className="text-xs font-medium">System</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Version</span>
                                <span className="font-mono text-xs text-slate-500">1.0.0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-xs">Visibility</span>
                                <Badge variant="secondary" className="text-[10px] h-5">Public</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div>
                    <h4 className="text-xs font-bold text-red-600 uppercase mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5" /> Danger Zone
                    </h4>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 space-y-4">
                        <div className="text-sm text-red-900/80 leading-relaxed">
                            Deleting this node will remove it from the curriculum.
                            {hasDependencies && " This action is currently blocked due to existing dependencies."}
                        </div>

                        {hasDependencies ? (
                            <div className="bg-white p-3 rounded border border-red-100 shadow-sm">
                                <div className="flex items-center gap-2 text-red-700 mb-1 font-medium text-xs uppercase tracking-wide">
                                    Cannot Delete
                                </div>
                                <p className="text-xs text-slate-600 mb-3 leading-snug">
                                    This item has <strong>{node.children?.length || 0} sub-items</strong> and <strong>{node.metadata?.questionsCount || 0} questions</strong> attached.
                                    <br />Please move or delete them before removing this item.
                                </p>
                                <Button variant="outline" size="sm" disabled className="w-full text-red-600 border-red-200 bg-red-50 opacity-50 cursor-not-allowed">
                                    Resolve {node.children?.length ? 'Sub-items' : 'Questions'} First
                                </Button>
                            </div>
                        ) : (
                            <Button variant="destructive" size="sm" className="w-full hover:bg-red-700" onClick={() => onAction?.('delete', node)}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete {node.type}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
    )
}
