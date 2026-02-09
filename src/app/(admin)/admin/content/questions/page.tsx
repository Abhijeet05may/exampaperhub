import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/admin/questions/data-table'
import { columns } from '@/components/admin/questions/columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function QuestionsPage() {
    const supabase = createClient()

    const { data: questions, error } = await supabase
        .from('questions')
        .select(`
            *,
            subjects (name),
            topics (name)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching questions:", error)
        return <div>Error loading questions</div>
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Question Bank</h2>
                    <p className="text-muted-foreground">
                        Manage your question database with advanced filtering and editing.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/admin/content/questions/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Question
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-1">
                <DataTable data={questions || []} columns={columns} />
            </div>
        </div>
    )
}
