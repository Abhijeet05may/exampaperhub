import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, AlertCircle } from "lucide-react"

export function QualityInsights() {
    return (
        <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-semibold">Quality Insights</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Without Explanation</span>
                        <span className="font-mono font-medium text-amber-600">12%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[12%]" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duplicate Suspicion</span>
                        <span className="font-mono font-medium text-red-600">3%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[3%]" />
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>Run a full quality audit to update these metrics.</span>
                </div>
            </CardContent>
        </Card>
    )
}
