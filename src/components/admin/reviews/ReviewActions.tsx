'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { reviewQuestion } from '@/app/(admin)/actions'
import { useToast } from "@/components/ui/use-toast"

interface ReviewActionsProps {
    questionId: string
}

export default function ReviewActions({ questionId }: ReviewActionsProps) {
    const [loading, setLoading] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [comment, setComment] = useState('')
    const { toast } = useToast()

    const handleAction = async (status: 'approved' | 'rejected') => {
        setLoading(true)
        try {
            await reviewQuestion(questionId, status, status === 'rejected' ? comment : undefined)
            toast({ title: `Question ${status}`, description: `The question has been ${status}.` })
            setRejectOpen(false)
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update review status." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="outline"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleAction('approved')}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>

            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={loading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Question</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this question.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="comment">Rejection Reason</Label>
                            <Textarea
                                id="comment"
                                placeholder="e.g. Inaccurate explanation, Formatting issue..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleAction('rejected')}
                            disabled={!comment || loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reject Question
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
