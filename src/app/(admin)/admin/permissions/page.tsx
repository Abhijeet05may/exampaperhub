"use client"

import { useState } from "react"
import {
    Shield,
    Save,
    RotateCcw,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

// Types
type Permission = {
    id: string
    name: string
    description: string
    category: 'Content' | 'Users' | 'System'
}

type Role = 'Admin' | 'Reviewer' | 'Uploader' | 'Viewer'

// Mock Data
const permissions: Permission[] = [
    { id: 'p1', name: 'View Questions', description: 'Can view question bank', category: 'Content' },
    { id: 'p2', name: 'Create Questions', description: 'Can create new questions', category: 'Content' },
    { id: 'p3', name: 'Edit Questions', description: 'Can edit existing questions', category: 'Content' },
    { id: 'p4', name: 'Delete Questions', description: 'Can delete questions', category: 'Content' },
    { id: 'p5', name: 'Approve Content', description: 'Can approve/reject submissions', category: 'Content' },
    { id: 'p6', name: 'Manage Users', description: 'Can invite and suspend users', category: 'Users' },
    { id: 'p7', name: 'View Audit Logs', description: 'Can view system activity', category: 'System' },
    { id: 'p8', name: 'Manage Settings', description: 'Can change system configuration', category: 'System' },
]

const initialMatrix: Record<Role, string[]> = {
    'Admin': ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
    'Reviewer': ['p1', 'p3', 'p5'],
    'Uploader': ['p1', 'p2'],
    'Viewer': ['p1']
}

export default function PermissionsPage() {
    const [matrix, setMatrix] = useState(initialMatrix)
    const [hasChanges, setHasChanges] = useState(false)

    const togglePermission = (role: Role, permissionId: string) => {
        setMatrix(prev => {
            const rolePermissions = prev[role]
            const hasPermission = rolePermissions.includes(permissionId)

            const newRolePermissions = hasPermission
                ? rolePermissions.filter(id => id !== permissionId)
                : [...rolePermissions, permissionId]

            return { ...prev, [role]: newRolePermissions }
        })
        setHasChanges(true)
    }

    const handleSave = () => {
        // Mock save API call
        setHasChanges(false)
    }

    const handleReset = () => {
        setMatrix(initialMatrix)
        setHasChanges(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Role Permissions</h1>
                    <p className="text-muted-foreground">Configure access levels for each role.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button onClick={handleSave} disabled={!hasChanges}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Permission</TableHead>
                            <TableHead className="text-center">Admin</TableHead>
                            <TableHead className="text-center">Reviewer</TableHead>
                            <TableHead className="text-center">Uploader</TableHead>
                            <TableHead className="text-center">Viewer</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.map((permission) => (
                            <TableRow key={permission.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{permission.name}</span>
                                        <span className="text-xs text-muted-foreground">{permission.description}</span>
                                    </div>
                                </TableCell>
                                {(['Admin', 'Reviewer', 'Uploader', 'Viewer'] as Role[]).map((role) => (
                                    <TableCell key={role} className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={matrix[role].includes(permission.id)}
                                                onCheckedChange={() => togglePermission(role, permission.id)}
                                                disabled={role === 'Admin' && permission.category === 'System'} // Prevent locking out admins
                                            />
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
