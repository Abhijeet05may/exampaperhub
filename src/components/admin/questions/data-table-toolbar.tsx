"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter questions..."
                    value={(table.getColumn("question_text")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("question_text")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("difficulty") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("difficulty")}
                        title="Difficulty"
                        options={[
                            { label: "Easy", value: "Easy" },
                            { label: "Medium", value: "Medium" },
                            { label: "Hard", value: "Hard" },
                        ]}
                    />
                )}
                {/* Add Status filter if/when status column exists and is populated */}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}
