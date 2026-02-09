import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface PipelineProps {
    draft: number
    review: number
    approved: number
}

export function PipelineView({ draft, review, approved }: PipelineProps) {
    const total = draft + review + approved

    // Percentage for simple visual bar
    const getPercent = (val: number) => total > 0 ? (val / total) * 100 : 0

    return (
        <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Content Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">{draft}</span>
                        <span className="text-muted-foreground text-xs">Draft</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-amber-600">{review}</span>
                        <span className="text-muted-foreground text-xs">In Review</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-emerald-600">{approved}</span>
                        <span className="text-muted-foreground text-xs">Approved</span>
                    </div>
                </div>

                {/* Visual Bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full flex overflow-hidden">
                    <div className="h-full bg-gray-400" style={{ width: `${getPercent(draft)}%` }} />
                    <div className="h-full bg-amber-500" style={{ width: `${getPercent(review)}%` }} />
                    <div className="h-full bg-emerald-500" style={{ width: `${getPercent(approved)}%` }} />
                </div>
            </CardContent>
        </Card>
    )
}
