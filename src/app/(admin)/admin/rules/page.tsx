"use client"

import { useState } from "react"
import {
    Plus,
    MoreHorizontal,
    Edit,
    Trash,
    AlertCircle,
    CheckCircle,
    XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RuleEditor, MarkingRule } from "@/components/admin/rules/RuleEditor"

// Mock Data
const initialRules: MarkingRule[] = [
    {
        id: '1',
        name: 'Standard MCQ',
        type: 'mcq',
        correctMarks: 4,
        negativeMarks: 1,
        isActive: true
    },
    {
        id: '2',
        name: 'JEE Main Pattern',
        type: 'mcq',
        correctMarks: 4,
        negativeMarks: 1,
        isActive: true
    },
    {
        id: '3',
        name: 'Subjective (Short)',
        type: 'subjective',
        correctMarks: 2,
        negativeMarks: 0,
        isActive: true
    },
    {
        id: '4',
        name: 'Integer Value',
        type: 'numerical',
        correctMarks: 3,
        negativeMarks: 0,
        isActive: false
    }
]

export default function RulesPage() {
    const [rules, setRules] = useState<MarkingRule[]>(initialRules)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [selectedRule, setSelectedRule] = useState<MarkingRule | null>(null)

    const handleCreate = () => {
        setSelectedRule(null)
        setIsEditorOpen(true)
    }

    const handleEdit = (rule: MarkingRule) => {
        setSelectedRule(rule)
        setIsEditorOpen(true)
    }

    const handleSave = (rule: MarkingRule) => {
        if (selectedRule) {
            setRules(rules.map(r => r.id === rule.id ? rule : r))
        } else {
            setRules([...rules, { ...rule, id: `rule-${Date.now()}` }])
        }
    }

    const handleDelete = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Marking Rules</h1>
                    <p className="text-muted-foreground">Define scoring logic and negative marking policies.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Create Rule
                </Button>
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Rule Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Correct</TableHead>
                            <TableHead>Negative</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell className="font-medium">{rule.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize font-normal">
                                        {rule.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-emerald-600 font-semibold">
                                    +{rule.correctMarks}
                                </TableCell>
                                <TableCell className="text-red-500 font-semibold">
                                    -{rule.negativeMarks}
                                </TableCell>
                                <TableCell>
                                    {rule.isActive ? (
                                        <div className="flex items-center text-emerald-600 text-xs font-medium">
                                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-muted-foreground text-xs">
                                            <XCircle className="h-3 w-3 mr-1" /> Inactive
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(rule)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(rule.id)}>
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <RuleEditor
                open={isEditorOpen}
                onOpenChange={setIsEditorOpen}
                rule={selectedRule}
                onSave={handleSave}
            />
        </div>
    )
}
