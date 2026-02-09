
'use client'

import { Check, Plus, AlertCircle } from 'lucide-react'
import { usePaperBucket } from '@/hooks/usePaperBucket'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
    question: any
}

export default function QuestionCard({ question }: QuestionCardProps) {
    const { questions, addQuestion, removeQuestion } = usePaperBucket()

    const isSelected = questions.some(q => q.id === question.id)

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
            case 'medium': return 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            case 'hard': return 'bg-rose-100 text-rose-800 hover:bg-rose-200'
            default: return 'bg-slate-100 text-slate-800'
        }
    }

    const handleToggle = () => {
        if (isSelected) {
            removeQuestion(question.id)
        } else {
            addQuestion(question)
        }
    }

    return (
        <Card className={cn(
            "transition-all duration-300 hover:shadow-md border-border/60",
            isSelected ? "border-primary/50 shadow-sm bg-primary/5" : "hover:border-primary/20 hover:bg-card/50"
        )}>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex gap-2">
                    <Badge variant="secondary" className={cn("font-medium capitalize shadow-none", getDifficultyColor(question.difficulty))}>
                        {question.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground bg-background/50">
                        {question.chapters?.name}
                    </Badge>
                </div>
                <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={handleToggle}
                    className={cn(
                        "h-8 px-3 transition-all",
                        isSelected ? "bg-primary text-primary-foreground shadow-md" : "text-primary hover:text-primary hover:bg-primary/10"
                    )}
                >
                    {isSelected ? (
                        <>
                            <Check className="mr-1 h-3.5 w-3.5" /> Added
                        </>
                    ) : (
                        <>
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                    <p className="font-medium text-base">{question.question_text}</p>

                    {question.image_url && (
                        <div className="mt-4 rounded-lg overflow-hidden border bg-muted/30">
                            <img
                                src={question.image_url}
                                alt="Question Diagram"
                                className="max-h-64 w-auto mx-auto object-contain"
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {[
                        { label: 'A', text: question.option_a },
                        { label: 'B', text: question.option_b },
                        { label: 'C', text: question.option_c },
                        { label: 'D', text: question.option_d }
                    ].map((opt) => (
                        <div key={opt.label} className="flex p-2 rounded-md bg-muted/40 border border-transparent hover:border-border transition-colors text-sm">
                            <span className="font-bold text-primary mr-3 w-4">{opt.label}.</span>
                            <span className="text-foreground/90">{opt.text}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
