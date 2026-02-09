"use client"

import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"

export interface MarkingRule {
    id: string
    name: string
    type: 'mcq' | 'subjective' | 'numerical'
    correctMarks: number
    negativeMarks: number
    isActive: boolean
}

interface RuleEditorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    rule?: MarkingRule | null
    onSave: (rule: MarkingRule) => void
}

const defaultRule: MarkingRule = {
    id: '',
    name: '',
    type: 'mcq',
    correctMarks: 1,
    negativeMarks: 0,
    isActive: true
}

export function RuleEditor({ open, onOpenChange, rule, onSave }: RuleEditorProps) {
    const [formData, setFormData] = useState<MarkingRule>(defaultRule)

    useEffect(() => {
        if (rule) {
            setFormData(rule)
        } else {
            setFormData({ ...defaultRule, id: `rule-${Date.now()}` })
        }
    }, [rule, open])

    const handleSave = () => {
        onSave(formData)
        onOpenChange(false)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{rule ? 'Edit Marking Rule' : 'Create Marking Rule'}</SheetTitle>
                    <SheetDescription>
                        Define how marks are awarded and deducted for questions.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 py-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Rule Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Standard MCQ (+4/-1)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Applicable Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mcq">Multiple Choice</SelectItem>
                                <SelectItem value="subjective">Subjective</SelectItem>
                                <SelectItem value="numerical">Numerical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="correct">Correct Answer</Label>
                            <div className="relative">
                                <Input
                                    id="correct"
                                    type="number"
                                    className="pl-8"
                                    value={formData.correctMarks}
                                    onChange={(e) => setFormData({ ...formData, correctMarks: parseFloat(e.target.value) })}
                                />
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-emerald-600">+</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="negative">Negative Marking</Label>
                            <div className="relative">
                                <Input
                                    id="negative"
                                    type="number"
                                    className="pl-8"
                                    value={formData.negativeMarks}
                                    onChange={(e) => setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) })}
                                />
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-red-600">-</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="active-mode" className="flex flex-col space-y-1">
                            <span>Active Status</span>
                            <span className="font-normal text-xs text-muted-foreground">
                                Enable this rule for new exams.
                            </span>
                        </Label>
                        <Switch
                            id="active-mode"
                            checked={formData.isActive}
                            onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
                        />
                    </div>
                </div>

                <SheetFooter>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Save Rule
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
