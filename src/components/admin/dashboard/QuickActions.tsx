import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Upload, FileText, CheckSquare, BookOpen, Settings } from "lucide-react"

export function QuickActions() {
    const actions = [
        {
            title: "Upload DOCX",
            icon: Upload,
            href: "/admin/content/upload",
            color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
        },
        {
            title: "Add Question",
            icon: FileText,
            href: "/admin/content/questions/new",
            color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
        },
        {
            title: "Review Queue",
            icon: CheckSquare,
            href: "/admin/content/review",
            color: "text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200"
        },
        {
            title: "Categories",
            icon: BookOpen,
            href: "/admin/categories",
            color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200"
        },
    ]

    return (
        <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className={`
                            flex flex-col items-center justify-center p-3 rounded-lg border transition-colors
                            ${action.color}
                        `}
                    >
                        <action.icon className="h-5 w-5 mb-2" />
                        <span className="text-xs font-medium text-center">{action.title}</span>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
