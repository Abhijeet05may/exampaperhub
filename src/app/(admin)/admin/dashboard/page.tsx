import { createClient } from '@/lib/supabase/server'
import { KPIGrid } from '@/components/admin/dashboard/KPIGrid'
import { AlertPanel } from '@/components/admin/dashboard/AlertPanel'
import { PipelineView } from '@/components/admin/dashboard/PipelineView'
import { QuickActions } from '@/components/admin/dashboard/QuickActions'
import { QualityInsights } from '@/components/admin/dashboard/QualityInsights'
import { ActivityTimeline } from '@/components/admin/dashboard/ActivityTimeline'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AdminDashboardPage() {
    const supabase = createClient()

    // --- 1. Fetch KPI Data ---
    const { count: totalQuestions } = await supabase.from('questions').select('*', { count: 'exact', head: true })
    const { count: draftQuestions } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'draft')
    const { count: pendingReview } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'pending_review')
    const { count: approvedQuestions } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'approved')

    // For "Today", we'd arguably need a date filter. For MVP, we'll just mock or use total count for now if date is hard.
    // Let's try to do a simple comparison if possible, or just use 0 if no easy way without a date func.
    // We'll trust the component handles raw numbers.
    const today = new Date().toISOString().split('T')[0]
    const { count: uploadsToday } = await supabase.from('docx_uploads').select('*', { count: 'exact', head: true }).gte('created_at', today)
    const { count: papersGenerated } = await supabase.from('saved_papers').select('*', { count: 'exact', head: true }).gte('created_at', today)

    // --- 2. Fetch Alert Data (Mock/Partial Real) ---
    // Failed parsing
    const { count: failedParsing } = await supabase.from('docx_uploads').select('*', { count: 'exact', head: true }).eq('status', 'failed')

    // Missing Answers (Mock: we don't have a direct 'missing_answer' status, but we can assume 'draft' might cover it)
    // We'll pass 0 for now or implement a specific query later.

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Command center for content operations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                        Last updated: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* 1. Alerts Section (Conditional) */}
            <AlertPanel
                failedParsing={failedParsing || 0}
                missingAnswers={0}
                reviewBacklog={pendingReview || 0}
            />

            {/* 2. KPI Grid */}
            <KPIGrid
                totalQuestions={totalQuestions || 0}
                draftQuestions={draftQuestions || 0}
                pendingReview={pendingReview || 0}
                approvedQuestions={approvedQuestions || 0}
                uploadsToday={uploadsToday || 0}
                papersGeneratedToday={papersGenerated || 0}
            />

            {/* 3. Main Grid Layout */}
            <div className="grid gap-6 md:grid-cols-12">

                {/* Left Column (Content Pipeline & Activity) */}
                <div className="md:col-span-8 space-y-6">
                    {/* Pipeline Visualization */}
                    <PipelineView
                        draft={draftQuestions || 0}
                        review={pendingReview || 0}
                        approved={approvedQuestions || 0}
                    />

                    {/* Recent Activity */}
                    <Card className="shadow-sm">
                        <CardHeader className="p-4 py-3 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                                <Button variant="ghost" size="sm" className="h-6 text-xs">View Log</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4">
                                <ActivityTimeline />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Actions & Insights) */}
                <div className="md:col-span-4 space-y-6">
                    <QuickActions />

                    <QualityInsights />

                    {/* Placeholder for Analytics Preview */}
                    <Card className="shadow-sm bg-muted/20 border-dashed">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">Analytics Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="h-32 flex items-center justify-center text-xs text-muted-foreground">
                            Chart placeholders
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
