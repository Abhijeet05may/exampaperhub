"use client"

import React, { useEffect, useState } from "react"
import {
    Search,
    ChevronRight,
    Home,
    RotateCcw,
    RotateCw,
    Command as CommandIcon,
    MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { CurriculumNode } from "./types"

interface CommandBarProps {
    breadcrumbs: { id: string; title: string; type: string }[]
    onNavigate: (id: string) => void
    onSearch: (query: string) => void
    onUndo: () => void
    onRedo: () => void
    canUndo: boolean
    canRedo: boolean
}

export function CommandBar({
    breadcrumbs,
    onNavigate,
    onSearch,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}: CommandBarProps) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div className="flex items-center justify-between p-2 border rounded-t-lg bg-white shadow-sm z-20 relative">
            {/* Left: Breadcrumbs & History */}
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
                {/* History Controls */}
                <div className="flex items-center gap-1 border-r pr-2 mr-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        disabled={!canUndo}
                        onClick={onUndo}
                        title="Undo (Ctrl+Z)"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        disabled={!canRedo}
                        onClick={onRedo}
                        title="Redo (Ctrl+Y)"
                    >
                        <RotateCw className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-hidden mask-linear-fade">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        onClick={() => onNavigate('')}
                    >
                        <Home className="h-3.5 w-3.5" />
                    </Button>

                    {breadcrumbs.map((item, index) => (
                        <div key={item.id} className="flex items-center">
                            <ChevronRight className="h-3 w-3 mx-1 opacity-50" />
                            <Button
                                variant="ghost"
                                className={`h-6 px-1.5 text-xs font-medium ${index === breadcrumbs.length - 1
                                        ? "text-foreground bg-slate-100"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                onClick={() => onNavigate(item.id)}
                            >
                                {item.title}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center: Command Palette Trigger */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-[400px]">
                <Button
                    variant="outline"
                    className="w-full h-8 justify-between text-muted-foreground font-normal bg-slate-50 border-slate-200 hover:bg-white transition-all shadow-sm group"
                    onClick={() => setOpen(true)}
                >
                    <span className="flex items-center gap-2">
                        <Search className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                        <span className="text-xs">Search curriculum...</span>
                    </span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
}
