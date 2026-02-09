'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Question {
    id: string
    question_text: string
    difficulty: string
    subjects: { name: string }
    topics: { name: string }
    created_at: string
}

export default function ReviewQueuePage() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const { toast } = useToast()

    const fetchQueue = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('questions')
            .select(`
                id,
                question_text,
                difficulty,
                created_at,
                subjects (name),
                topics (name)
            `)
            .eq('status', 'pending_review')
            .order('created_at', { ascending: false })

        if (data) setQuestions(data as unknown as Question[])
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchQueue()
    }, [fetchQueue])

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const status = action === 'approve' ? 'approved' : 'rejected' // Or 'draft' to send back? Using rejected for now.

        // Optimistic update
        setQuestions(questions.filter(q => q.id !== id))

        const { error } = await supabase
            .from('questions')
            .update({ status: status })
            .eq('id', id)

        if (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive"
            })
            fetchQueue() // Revert
        } else {
            toast({
                title: action === 'approve' ? "Approved" : "Rejected",
                description: `Question has been ${status}.`,
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
                    <p className="text-muted-foreground mt-1">Approve or reject questions submitted for review.</p>
                </div>
                <Button onClick={fetchQueue} variant="outline" size="sm">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[400px]">Question</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.length === 0 && !loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    All caught up! No questions pending review.
                                </TableCell>
                            </TableRow>
                        ) : (
                            questions.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell>
                                        <div dangerouslySetInnerHTML={{ __html: q.question_text.substring(0, 100) + '...' }} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-xs">{q.subjects?.name}</span>
                                            <span className="text-xs text-muted-foreground">{q.topics?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{q.difficulty}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                            onClick={() => handleAction(q.id, 'approve')}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() => handleAction(q.id, 'reject')}
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
