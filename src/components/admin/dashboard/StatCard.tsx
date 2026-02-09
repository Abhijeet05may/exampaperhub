import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: {
        value: number
        label: string
        positive?: boolean
    }
    className?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        {trend && (
                            <span className={trend.positive ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                                {trend.positive ? "↑" : "↓"} {trend.value}%
                            </span>
                        )}
                        <span>{description || trend?.label}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
