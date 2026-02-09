'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Check, Copy, Trash2, Upload, File, Loader2, RefreshCw } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { v4 as uuidv4 } from 'uuid'

const BUCKETS = [
    { id: 'question-images', label: 'Question Images' },
    { id: 'docx_uploads', label: 'DOCX Uploads' },
    // Add more if needed
]

interface FileObject {
    name: string
    id: string
    updated_at: string
    created_at: string
    last_accessed_at: string
    metadata: Record<string, any>
}

export default function MediaGallery() {
    const [selectedBucket, setSelectedBucket] = useState('question-images')
    const [files, setFiles] = useState<FileObject[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()
    const { toast } = useToast()

    const fetchFiles = async () => {
        setLoading(true)
        const { data, error } = await supabase.storage.from(selectedBucket).list(undefined, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
        })

        if (error) {
            console.error('Error fetching files:', error)
            toast({ variant: "destructive", title: "Error", description: "Failed to load files." })
        } else {
            setFiles(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFiles()
    }, [selectedBucket])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`

        const { error } = await supabase.storage.from(selectedBucket).upload(fileName, file)

        if (error) {
            toast({ variant: "destructive", title: "Upload Failed", description: error.message })
        } else {
            toast({ title: "Success", description: "File uploaded successfully." })
            fetchFiles()
        }
        setUploading(false)
    }

    const handleDelete = async (fileName: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return

        const { error } = await supabase.storage.from(selectedBucket).remove([fileName])

        if (error) {
            toast({ variant: "destructive", title: "Delete Failed", description: error.message })
        } else {
            toast({ title: "Deleted", description: "File removed successfully." })
            setFiles(files.filter(f => f.name !== fileName))
        }
    }

    const copyUrl = (fileName: string) => {
        const { data } = supabase.storage.from(selectedBucket).getPublicUrl(fileName)
        navigator.clipboard.writeText(data.publicUrl)
        toast({ title: "Copied", description: "Public URL copied to clipboard." })
    }

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[300px]"
                    />
                    <Button variant="outline" size="icon" onClick={fetchFiles} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium text-sm">
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Upload to {BUCKETS.find(b => b.id === selectedBucket)?.label}
                        </div>
                        <input id="file-upload" type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </Label>
                </div>
            </div>

            <Tabs value={selectedBucket} onValueChange={setSelectedBucket} className="w-full">
                <TabsList>
                    {BUCKETS.map(bucket => (
                        <TabsTrigger key={bucket.id} value={bucket.id}>{bucket.label}</TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                            <File className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p>No files found in this bucket.</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-300px)]">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
                                {filteredFiles.map((file) => (
                                    <ContextMenu key={file.id}>
                                        <ContextMenuTrigger>
                                            <Card className="overflow-hidden group hover:border-primary/50 transition-all cursor-pointer">
                                                <CardContent className="p-2">
                                                    <AspectRatio ratio={1} className="bg-muted rounded-sm overflow-hidden flex items-center justify-center relative">
                                                        {selectedBucket === 'question-images' ? (
                                                            <img
                                                                src={supabase.storage.from(selectedBucket).getPublicUrl(file.name).data.publicUrl}
                                                                alt={file.name}
                                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <File className="h-12 w-12 text-muted-foreground" />
                                                        )}
                                                    </AspectRatio>
                                                </CardContent>
                                                <CardFooter className="p-2 pt-0 flex flex-col items-start">
                                                    <p className="font-medium text-xs truncate w-full" title={file.name}>{file.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {(file.metadata?.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </CardFooter>
                                            </Card>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => copyUrl(file.name)}>
                                                <Copy className="mr-2 h-4 w-4" /> Copy URL
                                            </ContextMenuItem>
                                            <ContextMenuItem onClick={() => handleDelete(file.name)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </Tabs>
        </div>
    )
}
