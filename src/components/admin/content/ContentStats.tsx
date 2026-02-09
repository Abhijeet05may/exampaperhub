import { Card, CardContent } from "@/components/ui/card"
import { FileText, FileStack, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface ContentStatsProps {
    total: number
    processing: number
    pending: number
    approved: number
    rejected: number
}

export function ContentStats({ total, processing, pending, approved, rejected }: ContentStatsProps) {
    const stats = [
        {
            label: "Total Uploads",
            value: total,
            icon: FileStack,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "In Processing",
            value: processing,
            icon: FileText,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            label: "Pending Review",
            value: pending,
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            label: "Approved",
            value: approved,
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Rejected",
            value: rejected,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50"
        }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                            <div className={`p-1.5 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-3 w-3 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
