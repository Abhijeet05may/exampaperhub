"use client"

import React, { useState } from 'react'
import { CurriculumNode } from "./types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    FolderOpen,
    Search,
    Trash2,
    Move,
    PenLine,
    CheckSquare,
    Trophy
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface EntityBrowserProps {
    parentNode: CurriculumNode | null
    onSelect: (node: CurriculumNode) => void
    onAdd?: (type: any) => void
    onAction?: (action: string, node: CurriculumNode, data?: any) => void
}

export function EntityBrowser({ parentNode, onSelect, onAdd, onAction }: EntityBrowserProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState("")

    if (!parentNode) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <FolderOpen className="h-12 w-12 mb-4 opacity-20" />
                <p>Select an item from the tree to view its contents</p>
                {onAdd && (
                    <Button variant="link" className="mt-2" onClick={() => onAdd('subject')}>
                        Create new Subject
                    </Button>
                )}
            </div>
        )
    }

    const filteredChildren = parentNode.children?.filter(child =>
        child.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredChildren.map(c => c.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id])
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id))
        }
    }

    const startEditing = (node: CurriculumNode) => {
        setEditingId(node.id)
        setEditValue(node.title)
    }

    const saveEdit = () => {
        if (editingId && editValue.trim()) {
            // Find the node to pass to action
            const node = parentNode.children?.find(c => c.id === editingId)
            if (node && node.title !== editValue) {
                onAction?.('rename', node, { newTitle: editValue })
            }
        }
        setEditingId(null)
        setEditValue("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') saveEdit()
        if (e.key === 'Escape') {
            setEditingId(null)
            setEditValue("")
        }
    }

    if (!parentNode.children || parentNode.children.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-slate-50/30">
                <p>No items found in {parentNode.title}</p>
                {onAdd && (
                    <Button variant="link" className="mt-2" onClick={() => {
                        const typeMap: Record<string, string> = {
                            class: 'subject',
                            subject: 'book',
                            book: 'chapter',
                            chapter: 'topic'
                        }
                        onAdd(typeMap[parentNode.type] || 'item')
                    }}>
                        Add New Item
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Toolbar */}
            <div className="px-4 py-2 border-b flex items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter items..."
                            className="pl-9 h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onAdd && onAdd('item')}>
                        <Trophy className="mr-2 h-3.5 w-3.5" />
                        Add {parentNode.children?.[0]?.type || 'Item'}
                    </Button>
                </div>
            </div>

            {/* Floating Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                    <span className="text-sm font-medium">{selectedIds.length} selected</span>
                    <div className="h-4 w-px bg-slate-700" />
                    <button
                        className="text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
                        onClick={() => onAction?.('bulk-move', parentNode, { ids: selectedIds })}
                    >
                        <Move className="h-3.5 w-3.5" /> Move
                    </button>
                    <button
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-1"
                        onClick={() => onAction?.('bulk-delete', parentNode, { ids: selectedIds })}
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                    <button
                        className="ml-2 text-slate-500 hover:text-slate-300"
                        onClick={() => setSelectedIds([])}
                    >
                        X
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="w-[40px]">
                                <Checkbox
                                    checked={selectedIds.length === filteredChildren.length && filteredChildren.length > 0}
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Stats</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredChildren.map((child) => (
                            <TableRow
                                key={child.id}
                                className={`cursor-pointer group ${selectedIds.includes(child.id) ? 'bg-blue-50/50 hover:bg-blue-50/60' : 'hover:bg-slate-50'}`}
                                onClick={() => onSelect(child)}
                            >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selectedIds.includes(child.id)}
                                        onCheckedChange={(checked) => handleSelectOne(child.id, checked as boolean)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium py-2">
                                    {editingId === child.id ? (
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onBlur={saveEdit}
                                            autoFocus
                                            className="h-7 text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                            {child.title}
                                            <button
                                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 p-1 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    startEditing(child)
                                                }}
                                            >
                                                <PenLine className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize font-normal text-muted-foreground">
                                        {child.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2.5 w-2.5 rounded-full ${child.metadata?.status === 'archived' ? 'bg-slate-300'
                                                : child.metadata?.status === 'draft' ? 'bg-amber-400'
                                                    : 'bg-emerald-500'
                                            }`} />
                                        <span className="text-xs text-muted-foreground capitalize">{child.metadata?.status || 'Active'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground font-mono text-xs">
                                    {child.children?.length ? (
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">{child.children.length}</span>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(child) }}>
                                                Open
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); startEditing(child) }}>
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onAction?.('delete', child) }}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
