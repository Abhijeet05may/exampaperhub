"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export type Question = {
    id: string
    question_text: string
    difficulty: "Easy" | "Medium" | "Hard"
    subjects: { name: string } | null
    topics: { name: string } | null
    status: "approved" | "pending" | "rejected"
    created_at: string
}

export const columns: ColumnDef<Question>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "question_text",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Question" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("question_text")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "subjects",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Subject" />
        ),
        cell: ({ row }) => {
            const subject = row.original.subjects?.name
            return (
                <div className="flex w-[100px] items-center">
                    <span>{subject || 'N/A'}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.original.subjects?.name)
        },
    },
    {
        accessorKey: "difficulty",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Difficulty" />
        ),
        cell: ({ row }) => {
            const difficulty = row.getValue("difficulty") as string
            return (
                <div className="flex w-[100px] items-center">
                    <Badge variant={
                        difficulty === 'Easy' ? 'secondary' :
                            difficulty === 'Medium' ? 'outline' : // Changed to outline for better visibility difference
                                'destructive'
                    }>
                        {difficulty}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className="flex w-[100px] items-center">
                    <Badge variant={status === 'approved' ? 'default' : 'secondary'}>
                        {status}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center text-muted-foreground text-xs">
                    {new Date(row.getValue("created_at")).toLocaleDateString()}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
