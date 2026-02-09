import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, XCircle, AlertCircle } from "lucide-react"

interface AlertData {
    failedParsing: number
    missingAnswers: number
    reviewBacklog: number
}

export function AlertPanel({ failedParsing, missingAnswers, reviewBacklog }: AlertData) {
    if (failedParsing === 0 && missingAnswers === 0 && reviewBacklog < 5) {
        return null // Don't show if everything is healthy
    }

    return (
        <Card className="border-l-4 border-l-red-500 shadow-sm bg-red-50/10">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    System Alerts & Attention Needed
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
                {failedParsing > 0 && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100/50 p-2 rounded">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">{failedParsing} Parsing Jobs Failed</span>
                        <span className="text-muted-foreground text-xs ml-auto">Check Queue</span>
                    </div>
                )}
                {missingAnswers > 0 && (
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-100/50 p-2 rounded">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">{missingAnswers} Questions Missing Answers</span>
                        <span className="text-muted-foreground text-xs ml-auto">Fix Now</span>
                    </div>
                )}
                {reviewBacklog > 5 && (
                    <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100/50 p-2 rounded">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">High Review Backlog ({reviewBacklog} pending)</span>
                        <span className="text-muted-foreground text-xs ml-auto">Clear Queue</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
