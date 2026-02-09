'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface DragDropUploadProps {
    onUpload: (files: File[]) => void
    maxFiles?: number
    accept?: Record<string, string[]>
}

export function DragDropUpload({ onUpload, maxFiles = 1, accept = { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } }: DragDropUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        if (rejectedFiles.length > 0) {
            setError('Invalid file type or size. Please allow only DOCX files.')
            return
        }
        setError(null)
        setFiles(prev => [...prev, ...acceptedFiles].slice(0, maxFiles))
    }, [maxFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        accept,
        multiple: maxFiles > 1
    })

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setUploading(true)
        setUploadProgress(0)

        // Simulate upload progress for better UX
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval)
                    return 95
                }
                return prev + 5
            })
        }, 100)

        try {
            await onUpload(files)
            setUploadProgress(100)
            setTimeout(() => {
                setUploading(false)
                setFiles([])
                setUploadProgress(0)
            }, 1000)
        } catch (err: any) {
            setError(err.message || 'Upload failed')
            setUploading(false)
        } finally {
            clearInterval(interval)
        }
    }

    return (
        <div className="w-full space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
                    ${error ? 'border-destructive/50 bg-destructive/5' : ''}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-muted rounded-full">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supports .docx files up to 10MB
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {files.length > 0 && (
                <div className="space-y-3">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-card border rounded-md shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            {!uploading && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            {uploading && uploadProgress === 100 && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </div>
                    ))}

                    {uploading && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setFiles([])} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={uploading}>
                            {uploading ? 'Processing...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
