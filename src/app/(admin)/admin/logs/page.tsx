"use client"

import { useState } from "react"
import {
    Search,
    Filter,
    Clock,
    User,
    ShieldAlert,
    FileText,
    Settings,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Mock Logs
const logs = [
    {
        id: "log-1",
        action: "User Suspended",
        user: "Abhijeet Singh",
        role: "Admin",
        target: "mike@viewer.com",
        module: "Users",
        timestamp: "2 mins ago",
        severity: "high"
    },
    {
        id: "log-2",
        action: "Template Updated",
        user: "John Doe",
        role: "Reviewer",
        target: "Weekly Test Template",
        module: "Templates",
        timestamp: "15 mins ago",
        severity: "medium"
    },
    {
        id: "log-3",
        action: "Login Success",
        user: "Sarah Smith",
        role: "Uploader",
        target: "System",
        module: "Auth",
        timestamp: "1 hour ago",
        severity: "low"
    },
    {
        id: "log-4",
        action: "Settings Changed",
        user: "Abhijeet Singh",
        role: "Admin",
        target: "Security Policy",
        module: "Settings",
        timestamp: "2 hours ago",
        severity: "high"
    },
    {
        id: "log-5",
        action: "Question Deleted",
        user: "John Doe",
        role: "Reviewer",
        target: "Q-1294",
        module: "Content",
        timestamp: "5 hours ago",
        severity: "medium"
    },
]

export default function LogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">Track system activity and security events.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-9" />
                </div>
                <Select>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="settings">Settings</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {log.severity === 'high' ? (
                                            <ShieldAlert className="h-4 w-4 text-red-500" />
                                        ) : log.severity === 'medium' ? (
                                            <Settings className="h-4 w-4 text-amber-500" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-blue-500" />
                                        )}
                                        <span className="font-medium">{log.action}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{log.user}</span>
                                        <span className="text-xs text-muted-foreground">{log.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal">
                                        {log.module}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {log.target}
                                </TableCell>
                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                    {log.timestamp}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
