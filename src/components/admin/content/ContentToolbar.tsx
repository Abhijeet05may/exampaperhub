"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Upload, Plus, Download, Filter } from "lucide-react"
import Link from "next/link"

export function ContentToolbar() {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
            {/* Search & Filter */}
            <div className="flex w-full sm:w-auto gap-2 items-center flex-1">
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search content..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Link href="/admin/content/questions/new">
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Manual
                    </Button>
                </Link>
                <Link href="/admin/content/upload">
                    <Button size="sm">
                        <Upload className="mr-2 h-4 w-4" /> Upload
                    </Button>
                </Link>
            </div>
        </div>
    )
}
