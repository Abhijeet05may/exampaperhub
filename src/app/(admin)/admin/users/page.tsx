"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/users/data-table"
import { columns, User } from "@/components/admin/users/columns"

// Mock Data
const users: User[] = [
    {
        id: "1",
        name: "Abhijeet Singh",
        email: "abhijeet@exampaperhub.com",
        role: "admin",
        status: "active",
        lastLogin: "2 hours ago",
    },
    {
        id: "2",
        name: "John Doe",
        email: "john@school.edu",
        role: "reviewer",
        status: "active",
        lastLogin: "1 day ago",
    },
    {
        id: "3",
        name: "Sarah Smith",
        email: "sarah@content.com",
        role: "uploader",
        status: "pending",
        lastLogin: "Never",
    },
    {
        id: "4",
        name: "Mike Johnson",
        email: "mike@viewer.com",
        role: "viewer",
        status: "suspended",
        lastLogin: "1 month ago",
    },
    // Generate more mock data for pagination testing
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `${i + 5}`,
        name: `User ${i + 5}`,
        email: `user${i + 5}@example.com`,
        role: ["admin", "reviewer", "uploader", "viewer"][Math.floor(Math.random() * 4)] as User["role"],
        status: ["active", "suspended", "pending"][Math.floor(Math.random() * 3)] as User["status"],
        lastLogin: `${Math.floor(Math.random() * 30)} days ago`,
    })),
]

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage access, roles, and permissions.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Invite User
                </Button>
            </div>

            <DataTable columns={columns} data={users} />
        </div>
    )
}
