"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { UserProfile } from "./columns" // Import type

interface UserRoleActionsProps {
    row: Row<UserProfile>
}

export function UserRoleActions({ row }: UserRoleActionsProps) {
    const router = useRouter()
    const supabase = createClient()
    const user = row.original

    const handleRoleChange = async (newRole: string) => {
        // 1. Update user_roles table
        const { error } = await supabase
            .from('user_roles')
            .update({ role: newRole })
            .eq('user_id', user.id)

        if (error) {
            alert("Failed to update role")
            console.error(error)
        } else {
            router.refresh()
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={user.role} onValueChange={handleRoleChange}>
                            <DropdownMenuRadioItem value="student">Student</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="reviewer">Reviewer</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="editor">Editor</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                    Block User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
