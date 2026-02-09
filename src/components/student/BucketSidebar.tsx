'use client'

import { usePaperBucket } from '@/hooks/usePaperBucket'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trash2, FileText, ArrowRight, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BucketSidebar() {
    const { questions, removeQuestion, clearBucket } = usePaperBucket()
    const router = useRouter()

    if (questions.length === 0) {
        return (
            <Card className="border-dashed border-2 shadow-sm bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground space-y-2">
                    <FileText className="h-10 w-10 opacity-20" />
                    <p className="font-medium">Your bucket is empty</p>
                    <p className="text-xs">Add questions to build a paper</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg border-primary/20 sticky top-4">
            <CardHeader className="pb-3 bg-primary/5 border-b border-primary/10">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Paper Bucket
                        <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">
                            {questions.length}
                        </Badge>
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={clearBucket} className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Clear All">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)] px-4 py-3">
                    <div className="space-y-3">
                        {questions.map((q, index) => (
                            <div key={q.id} className="group relative flex items-start gap-3 p-3 rounded-lg border bg-card hover:border-primary/30 transition-all">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                                    {index + 1}
                                </span>
                                <div className="flex-1 space-y-1 overflow-hidden">
                                    <p className="text-sm font-medium leading-none truncate pr-4">
                                        {q.question_text}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-transparent bg-muted">
                                            {q.difficulty}
                                        </Badge>
                                        <span className="truncate max-w-[100px]">{q.topics?.name}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeQuestion(q.id)}
                                    className="h-6 w-6 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-muted/10 space-y-3">
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Total Questions:</span>
                            <span className="font-medium text-foreground">{questions.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Estimated Time:</span>
                            <span className="font-medium text-foreground">{questions.length * 1.5} mins</span>
                        </div>
                    </div>

                    <Button onClick={() => router.push('/paper')} className="w-full font-bold shadow-md group">
                        Review & Generate
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
