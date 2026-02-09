"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, Loader2, Eye, Edit, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

interface ContentItem {
    id: string
    title: string
    type: 'question' | 'upload'
    category: string
    difficulty?: string
    status: string
    updatedAt: string
}

interface ContentTableProps {
    data: ContentItem[]
    loading?: boolean
}

export function ContentTable({ data, loading }: ContentTableProps) {
    if (loading) {
        return (
            <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            case 'completed': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            case 'pending_review': return 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            case 'processing': return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            case 'failed': return 'bg-red-100 text-red-700 hover:bg-red-200'
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
    }

    return (
        <div className="rounded-md border bg-white overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[40px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Last Updated</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                No content found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium truncate max-w-[300px]">{item.title}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{item.id.substring(0, 8)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{item.category}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize font-normal text-xs">
                                        {item.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${getStatusColor(item.status)} shadow-none border-0 font-medium capitalize`}>
                                        {item.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground text-sm">
                                    {new Date(item.updatedAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Content
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
