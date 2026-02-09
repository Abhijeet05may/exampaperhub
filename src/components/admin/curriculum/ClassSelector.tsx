"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { School } from "lucide-react"

interface ClassSelectorProps {
    classes: { id: string, name: string }[]
    selectedClassId?: string
    onSelect: (id: string) => void
    isLoading?: boolean
}

export function ClassSelector({
    classes,
    selectedClassId,
    onSelect,
    isLoading
}: ClassSelectorProps) {
    return (
        <div className="flex items-center gap-2 min-w-[200px]">
            <div className="p-2 bg-primary/10 rounded-md text-primary">
                <School className="h-5 w-5" />
            </div>
            <Select
                value={selectedClassId}
                onValueChange={onSelect}
                disabled={isLoading || classes.length === 0}
            >
                <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Select Class..." />
                </SelectTrigger>
                <SelectContent>
                    {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
