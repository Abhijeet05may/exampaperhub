import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUp, UserPlus, FileText, CheckCircle, AlertCircle } from "lucide-react"

const activities = [
    {
        user: "Admin User",
        action: "Uploaded DOCX",
        target: "Physics_Ch1.docx",
        time: "2 mins ago",
        icon: FileUp,
        color: "text-blue-500"
    },
    {
        user: "System",
        action: "Parsing Completed",
        target: "Biology_Final.docx",
        time: "15 mins ago",
        icon: CheckCircle,
        color: "text-green-500"
    },
    {
        user: "Student john_doe",
        action: "Joined",
        target: "Class 12 - Science",
        time: "1 hour ago",
        icon: UserPlus,
        color: "text-purple-500"
    },
    {
        user: "Admin User",
        action: "Generated Paper",
        target: "Math_Mock_Test_1",
        time: "3 hours ago",
        icon: FileText,
        color: "text-orange-500"
    },
    {
        user: "System",
        action: "Failed Upload",
        target: "Corrupted_File.docx",
        time: "5 hours ago",
        icon: AlertCircle,
        color: "text-red-500"
    }
]

export function ActivityTimeline() {
    return (
        <Card className="col-span-3 lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                                <div className={`mt-1 p-2 rounded-full bg-slate-100 ${activity.color}`}>
                                    <activity.icon className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        <span className="font-semibold">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {activity.target}
                                    </p>
                                    <p className="text-xs text-muted-foreground/60">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
