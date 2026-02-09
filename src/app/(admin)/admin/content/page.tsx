import { createClient } from '@/lib/supabase/server'
import { ContentStats } from '@/components/admin/content/ContentStats'
import { ContentTable } from '@/components/admin/content/ContentTable'
import { ContentToolbar } from '@/components/admin/content/ContentToolbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminContentPage() {
    const supabase = createClient()

    // 1. Fetch Stats
    // Using parallel fetching for performance
    const [
        { count: totalUploads },
        { count: processingUploads },
        { count: pendingQuestions },
        { count: approvedQuestions },
        { count: draftQuestions }
    ] = await Promise.all([
        supabase.from('docx_uploads').select('*', { count: 'exact', head: true }),
        supabase.from('docx_uploads').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    ])

    // 2. Fetch Initial Data (Combined View - simplified for MVP)
    // We'll fetch mostly questions for the main table, as uploads are a precursor
    // Ideally we would union them or have separate tabs load separate data.
    // Let's implement fetching recent questions as the default view.
    const { data: questions } = await supabase
        .from('questions')
        .select(`
            id,
            question_text,
            status,
            created_at,
            difficulty,
            subjects(name)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

    // Transform for table
    const tableData = questions?.map((q: any) => ({
        id: q.id,
        title: q.question_text || 'Untitled Question',
        type: 'question' as const,
        category: q.subjects?.name || 'Uncategorized',
        difficulty: q.difficulty,
        status: q.status,
        updatedAt: q.created_at
    })) || []

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex-none space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground">Manage uploads, questions, and reviewing workflow.</p>
                </div>

                <ContentStats
                    total={totalUploads || 0}
                    processing={processingUploads || 0}
                    pending={pendingQuestions || 0}
                    approved={approvedQuestions || 0}
                    rejected={0} // Need to implement rejected status
                />

                <ContentToolbar />
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <Tabs defaultValue="all" className="h-full flex flex-col">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                        <TabsTrigger
                            value="all"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                        >
                            All Content
                        </TabsTrigger>
                        <TabsTrigger
                            value="processing"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                        >
                            Processing
                        </TabsTrigger>
                        <TabsTrigger
                            value="review"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                        >
                            Pending Review
                        </TabsTrigger>
                        <TabsTrigger
                            value="approved"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
                        >
                            Approved
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="flex-1 mt-4 overflow-auto">
                        <ContentTable data={tableData} />
                    </TabsContent>

                    <TabsContent value="processing" className="flex-1 mt-4">
                        <div className="text-center py-10 text-muted-foreground">Filtered view coming soon</div>
                    </TabsContent>
                    <TabsContent value="review" className="flex-1 mt-4">
                        <div className="text-center py-10 text-muted-foreground">Filtered view coming soon</div>
                    </TabsContent>
                    <TabsContent value="approved" className="flex-1 mt-4">
                        <div className="text-center py-10 text-muted-foreground">Filtered view coming soon</div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
