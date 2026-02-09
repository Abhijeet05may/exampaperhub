"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface QuestionMetadataProps {
    data: any
    onChange: (field: string, value: any) => void
}

export function QuestionMetadata({ data, onChange }: QuestionMetadataProps) {
    return (
        <div className="space-y-6">
            {/* Taxonomy */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Classification</h3>

                <div className="grid gap-2">
                    <Label>Class</Label>
                    <Select value={data.classId} onValueChange={(v) => onChange('classId', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="c-1">Class 10</SelectItem>
                            <SelectItem value="c-2">Class 12</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Subject</Label>
                    <Select value={data.subjectId} onValueChange={(v) => onChange('subjectId', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="s-1">Mathematics</SelectItem>
                            <SelectItem value="s-2">Science</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Chapter</Label>
                    <Select value={data.chapterId} onValueChange={(v) => onChange('chapterId', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ch-1">Real Numbers</SelectItem>
                            <SelectItem value="ch-2">Polynomials</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Topic</Label>
                    <Select value={data.topicId} onValueChange={(v) => onChange('topicId', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="t-1">Euclid Division Lemma</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Properties */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Properties</h3>

                <div className="grid gap-2">
                    <Label>Difficulty</Label>
                    <Select value={data.difficulty} onValueChange={(v) => onChange('difficulty', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Question Type</Label>
                    <Select value={data.type} onValueChange={(v) => onChange('type', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="subjective">Subjective</SelectItem>
                            <SelectItem value="true_false">True / False</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Marks</Label>
                        <Input
                            type="number"
                            value={data.marks}
                            onChange={(e) => onChange('marks', parseInt(e.target.value))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Negative</Label>
                        <Input
                            type="number"
                            value={data.negativeMarks}
                            onChange={(e) => onChange('negativeMarks', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {data.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1">
                            {tag}
                            <Button variant="ghost" size="icon" className="h-3 w-3 ml-1 hover:text-red-600">
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
                <Input placeholder="Add a tag..." onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        // Add tag logic
                    }
                }} />
            </div>
        </div>
    )
}
