"use client"

import { useState } from "react"
import {
    Search,
    Filter,
    Upload,
    Grid,
    List,
    MoreHorizontal,
    Trash2,
    Copy,
    Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Mock Data
const initialAssets = [
    { id: '1', name: 'diagram_q1_v2.png', type: 'image/png', size: '1.2 MB', uploaded: '2 days ago', usage: 12 },
    { id: '2', name: 'school_logo_header.jpg', type: 'image/jpeg', size: '450 KB', uploaded: '1 week ago', usage: 5 },
    { id: '3', name: 'physics_kinetic_energy.png', type: 'image/png', size: '2.1 MB', uploaded: '3 days ago', usage: 1 },
    { id: '4', name: 'math_geometry_circle.svg', type: 'image/svg+xml', size: '12 KB', uploaded: '1 day ago', usage: 8 },
    { id: '5', name: 'chemistry_periodic_table.pdf', type: 'application/pdf', size: '5.6 MB', uploaded: '1 month ago', usage: 4 },
]

export default function MediaLibraryPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [assets, setAssets] = useState(initialAssets)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
                    <p className="text-muted-foreground">Manage and organize your digital assets.</p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload New
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search assets..." className="pl-9 bg-slate-50 border-transparent hover:border-input focus:border-input" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <div className="border-l h-6 mx-2"></div>
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {assets.map((asset) => (
                        <div key={asset.id} className="group relative border rounded-lg bg-white hover:shadow-md transition-shadow overflow-hidden">
                            {/* Preview Thumbnail */}
                            <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                                {asset.type.startsWith('image') ? (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        <ImageIcon className="h-12 w-12 opacity-50" />
                                    </div>
                                ) : (
                                    <div className="text-slate-400">
                                        <FileText className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Copy className="mr-2 h-4 w-4" /> Copy Link
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="p-3">
                                <h3 className="font-medium text-sm truncate" title={asset.name}>{asset.name}</h3>
                                <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                                    <span>{asset.size}</span>
                                    <span>{asset.uploaded}</span>
                                </div>
                            </div>

                            {/* Usage Badge */}
                            <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[10px] h-5">
                                    Used in {asset.usage}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border">
                    {/* List View Implementation Placeholder */}
                    <div className="p-8 text-center text-muted-foreground">
                        List view coming soon...
                    </div>
                </div>
            )}
        </div>
    )
}

function DropdownMenuSeparator() {
    return <div className="h-px bg-muted my-1" />
}

function Eye({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

function FileText({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
    )
}
