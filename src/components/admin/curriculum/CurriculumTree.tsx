"use client"

import React, { useState } from 'react'
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FileText,
    MoreHorizontal,
    Plus,
    GraduationCap,
    BookOpen,
    Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Types
export type NodeType = 'class' | 'subject' | 'chapter' | 'topic'

export interface CurriculumNode {
    id: string
    title: string
    type: NodeType
    children?: CurriculumNode[]
    metadata?: {
        questionsCount?: number
        code?: string
    }
}

interface CurriculumTreeProps {
    data: CurriculumNode[]
    onSelect: (node: CurriculumNode) => void
    selectedId?: string
}

const TreeNode = ({
    node,
    level = 0,
    onSelect,
    selectedId
}: {
    node: CurriculumNode,
    level?: number,
    onSelect: (node: CurriculumNode) => void,
    selectedId?: string
}) => {
    const [isExpanded, setIsExpanded] = useState(level < 2) // Default expand top levels
    const hasChildren = node.children && node.children.length > 0
    const isSelected = selectedId === node.id

    const getIcon = (type: NodeType) => {
        switch (type) {
            case 'class': return GraduationCap
            case 'subject': return BookOpen
            case 'chapter': return Folder
            case 'topic': return Bookmark
            default: return FileText
        }
    }

    const Icon = getIcon(node.type)

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-colors group",
                    isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect(node)
                }}
            >
                <div
                    className={cn(
                        "p-0.5 mr-1 rounded-sm hover:bg-slate-200 text-muted-foreground transition-colors",
                        !hasChildren && "opacity-0 pointer-events-none"
                    )}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsExpanded(!isExpanded)
                    }}
                >
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </div>

                <Icon className={cn("h-4 w-4 mr-2", isSelected ? "text-primary" : "text-slate-500")} />

                <span className="flex-1 text-sm font-medium truncate">{node.title}</span>

                {node.metadata?.questionsCount !== undefined && (
                    <span className="text-xs text-muted-foreground mr-2 group-hover:block hidden">
                        {node.metadata.questionsCount} qs
                    </span>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Add Child</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isExpanded && hasChildren && (
                <div>
                    {node.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onSelect={onSelect}
                            selectedId={selectedId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function CurriculumTree({ data, onSelect, selectedId }: CurriculumTreeProps) {
    return (
        <div className="space-y-1 py-2">
            {data.map((node) => (
                <TreeNode
                    key={node.id}
                    node={node}
                    onSelect={onSelect}
                    selectedId={selectedId}
                />
            ))}

            <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm pl-8 mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Class
            </Button>
        </div>
    )
}
