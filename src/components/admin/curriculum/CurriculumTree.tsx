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
    Bookmark,
    Library,
    Pencil,
    Copy,
    Archive,
    Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
} from "@/components/ui/context-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CurriculumNode, NodeType } from './types'
import { Badge } from "@/components/ui/badge"

interface CurriculumTreeProps {
    data: CurriculumNode[]
    onSelect: (node: CurriculumNode) => void
    selectedId?: string
    onAction?: (action: string, node: CurriculumNode) => void
}

const TreeNode = ({
    node,
    level = 0,
    onSelect,
    selectedId,
    onAction
}: {
    node: CurriculumNode,
    level?: number,
    onSelect: (node: CurriculumNode) => void,
    selectedId?: string,
    onAction?: (action: string, node: CurriculumNode) => void
}) => {
    const [isExpanded, setIsExpanded] = useState(level < 1)
    const hasChildren = node.children && node.children.length > 0
    const isSelected = selectedId === node.id

    const getIcon = (type: NodeType) => {
        switch (type) {
            case 'class': return GraduationCap
            case 'subject': return Library
            case 'book': return BookOpen
            case 'chapter': return Folder
            case 'topic': return Bookmark
            default: return FileText
        }
    }

    const Icon = getIcon(node.type)
    const indent = level * 16 + 12

    // Status Color
    const statusColor = node.metadata?.status === 'archived' ? 'text-gray-400'
        : node.metadata?.status === 'draft' ? 'text-amber-500'
            : 'text-slate-500'

    return (
        <div className="select-none text-sm group/row relative">
            {/* Visual Depth Line */}
            {level > 0 && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-px bg-border/50"
                    style={{ left: `${indent - 16}px` }}
                />
            )}

            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        className={cn(
                            "flex items-center py-1 pr-2 cursor-pointer transition-colors relative min-h-[28px]",
                            isSelected ? "bg-blue-50/80 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                        )}
                        style={{ paddingLeft: `${indent}px` }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onSelect(node)
                        }}
                    >
                        {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 rounded-r shadow-sm" />
                        )}

                        {/* Expand Toggle */}
                        <div
                            className={cn(
                                "p-0.5 mr-0.5 rounded-sm text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors z-10",
                                !hasChildren && "opacity-0 pointer-events-none"
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsExpanded(!isExpanded)
                            }}
                        >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </div>

                        {/* Node Icon */}
                        <Icon className={cn(
                            "h-4 w-4 mr-2 shrink-0 transition-colors",
                            isSelected ? "text-blue-600" : statusColor,
                            node.metadata?.status === 'archived' && "opacity-70"
                        )} />

                        {/* Title & Stats */}
                        <div className="flex-1 flex items-center justify-between overflow-hidden gap-2">
                            <span className={cn(
                                "truncate font-medium transition-opacity",
                                isSelected ? "font-semibold" : "opacity-90",
                                node.metadata?.status === 'archived' && "line-through opacity-60"
                            )}>
                                {node.title}
                            </span>

                            <div className="flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                {/* Question Count Badge */}
                                {node.metadata?.questionsCount ? (
                                    <span className="text-[10px] text-muted-foreground bg-slate-100 px-1.5 rounded-full whitespace-nowrap">
                                        {node.metadata.questionsCount} qs
                                    </span>
                                ) : null}

                                {/* Child Count / Empty State */}
                                {hasChildren ? (
                                    !isExpanded && (
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 text-muted-foreground border-slate-200 font-normal">
                                            {node.children?.length}
                                        </Badge>
                                    )
                                ) : (
                                    ['subject', 'book', 'chapter'].includes(node.type) && (
                                        <span className="text-[9px] text-amber-600/70 bg-amber-50 px-1 rounded border border-amber-100">
                                            Empty
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={() => onAction?.('rename', node)}>
                        <Pencil className="mr-2 h-4 w-4" /> Rename
                    </ContextMenuItem>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <Plus className="mr-2 h-4 w-4" /> Add Child
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuItem onClick={() => onAction?.('add-book', node)}>
                                <BookOpen className="mr-2 h-4 w-4" /> Book
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => onAction?.('add-chapter', node)}>
                                <Folder className="mr-2 h-4 w-4" /> Chapter
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => onAction?.('add-topic', node)}>
                                <Bookmark className="mr-2 h-4 w-4" /> Topic
                            </ContextMenuItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => onAction?.('duplicate', node)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => onAction?.('archive', node)}>
                        <Archive className="mr-2 h-4 w-4" /> Archive
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem className="text-red-600 focus:text-red-600" onClick={() => onAction?.('delete', node)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            {isExpanded && hasChildren && (
                <div>
                    {node.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onSelect={onSelect}
                            selectedId={selectedId}
                            onAction={onAction}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function CurriculumTree({ data, onSelect, selectedId, onAction }: CurriculumTreeProps) {
    return (
        <ScrollArea className="flex-1">
            <div className="py-2 pb-10">
                {data.length === 0 ? (
                    <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                        <p>No items in this class.</p>
                        <Button variant="link" onClick={() => onAction?.('add-subject', null!)} className="h-auto p-0 text-xs mt-1">
                            Add a subject to get started.
                        </Button>
                    </div>
                ) : (
                    data.map((node) => (
                        <TreeNode
                            key={node.id}
                            node={node}
                            onSelect={onSelect}
                            selectedId={selectedId}
                            onAction={onAction}
                        />
                    ))
                )}
            </div>
        </ScrollArea>
    )
}
