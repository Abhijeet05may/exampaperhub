import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, History } from 'lucide-react'

export default function StudentDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Ready to practice?</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Question Bank
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Browse</div>
                        <p className="text-xs text-muted-foreground">
                            Practice questions by topic
                        </p>
                        <Link href="/browse" className="mt-4 block">
                            <Button className="w-full" variant="outline">Start Practicing</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Saved Papers
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">View</div>
                        <p className="text-xs text-muted-foreground">
                            Access your generated papers
                        </p>
                        <Link href="/saved-papers" className="mt-4 block">
                            <Button className="w-full" variant="outline">View Papers</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            History
                        </CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Recent</div>
                        <p className="text-xs text-muted-foreground">
                            See your activity
                        </p>
                        <Button className="w-full mt-4" variant="ghost" disabled>Coming Soon</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
