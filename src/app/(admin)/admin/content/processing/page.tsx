'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, FileText } from "lucide-react"

interface UploadJob {
    id: string
    filename: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    created_at: string
    storage_path: string
}

export default function ProcessingQueuePage() {
    const [jobs, setJobs] = useState<UploadJob[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchJobs = useCallback(async () => {
        setLoading(true)
        const { data } = await supabase
            .from('docx_uploads')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setJobs(data as UploadJob[])
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchJobs()

        // Real-time subscription
        const channel = supabase
            .channel('docx_uploads_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'docx_uploads'
                },
                (payload) => {
                    fetchJobs()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchJobs, supabase])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Processing Queue</h1>
                    <p className="text-muted-foreground mt-1">Monitor the status of uploaded DOCX files.</p>
                </div>
                <Button onClick={fetchJobs} variant="outline" size="sm">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Filename</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Uploaded At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.length === 0 && !loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No uploads found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {job.filename}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                job.status === 'completed' ? 'default' :
                                                    job.status === 'failed' ? 'destructive' :
                                                        job.status === 'processing' ? 'secondary' : 'outline'
                                            }
                                            className="capitalize"
                                        >
                                            {job.status === 'processing' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(job.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" disabled>
                                            View Logs
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
