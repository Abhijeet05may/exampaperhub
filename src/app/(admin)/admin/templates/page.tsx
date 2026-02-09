"use client"

import Link from 'next/link'
import { Plus, FileText, MoreHorizontal, Copy, Trash, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Data
const templates = [
    {
        id: '1',
        title: 'Weekly Unit Test',
        type: 'weekly',
        sections: 2,
        totalMarks: 25,
        duration: 45,
        updatedAt: '2 days ago',
        status: 'published'
    },
    {
        id: '2',
        title: 'Science Terminal Exam',
        type: 'terminal',
        sections: 3,
        totalMarks: 80,
        duration: 180,
        updatedAt: '1 week ago',
        status: 'draft'
    },
    {
        id: '3',
        title: 'Math Entrance Test',
        type: 'entrance',
        sections: 1,
        totalMarks: 100,
        duration: 120,
        updatedAt: '3 weeks ago',
        status: 'published'
    }
]

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Paper Templates</h1>
                    <p className="text-muted-foreground">Manage exam layouts and structures.</p>
                </div>
                <Link href="/admin/templates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Template
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant={template.status === 'published' ? 'default' : 'secondary'} className="capitalize mb-2">
                                    {template.status}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="-mt-1 -mr-2 h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="leading-snug">{template.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span>{template.sections} Sections</span>
                                </div>
                                <div>•</div>
                                <span>{template.totalMarks} Marks</span>
                                <div>•</div>
                                <span>{template.duration} Mins</span>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 text-xs text-muted-foreground justify-between">
                            <span>Updated {template.updatedAt}</span>
                            <Link href={`/admin/templates/${template.id}`}>
                                <Button variant="ghost" size="sm" className="h-7">
                                    Edit Layout
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
