import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileStack, AlertCircle, CheckCircle, Upload, File } from "lucide-react"

interface KPIProps {
    totalQuestions: number
    draftQuestions: number
    pendingReview: number
    approvedQuestions: number
    uploadsToday: number
    papersGeneratedToday: number
}

export function KPIGrid({
    totalQuestions,
    draftQuestions,
    pendingReview,
    approvedQuestions,
    uploadsToday,
    papersGeneratedToday
}: KPIProps) {
    const kpis = [
        {
            title: "Total Questions",
            value: totalQuestions,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-100",
            change: "+12% from last month" // Mock trend
        },
        {
            title: "Drafts",
            value: draftQuestions,
            icon: FileStack,
            color: "text-gray-600",
            bg: "bg-gray-100",
            change: "Active work in progress"
        },
        {
            title: "Pending Review",
            value: pendingReview,
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-100",
            change: pendingReview > 10 ? "Requires attention" : "On track"
        },
        {
            title: "Approved",
            value: approvedQuestions,
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            change: "Ready for use"
        },
        {
            title: "Uploads Today",
            value: uploadsToday,
            icon: Upload,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
            change: "Files processed"
        },
        {
            title: "Papers Generated",
            value: papersGeneratedToday,
            icon: File,
            color: "text-purple-600",
            bg: "bg-purple-100",
            change: "Today"
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map((kpi, index) => (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {kpi.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${kpi.bg}`}>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {kpi.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
