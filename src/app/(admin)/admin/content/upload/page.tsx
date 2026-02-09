
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CategorySelector from '@/components/admin/CategorySelector'
import { UploadCloud, FileText, Loader2, Check, AlertCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { DragDropUpload } from '@/components/admin/upload/DragDropUpload'
import { parseDocxAction } from './actions'
import { useToast } from "@/components/ui/use-toast"

export default function DocxUploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [parsing, setParsing] = useState(false)
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [selectedBook, setSelectedBook] = useState('')
    const [selectedChapter, setSelectedChapter] = useState('')
    const [selectedTopic, setSelectedTopic] = useState('')

    const supabase = createClient()
    const router = useRouter()

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">Upload Questions from DOCX</h1>
                <p className="text-gray-600 mb-6">
                    Upload a DOCX file containing multiple choice questions. The system will extract questions, options, answers, and images.
                </p>

                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                    <CategorySelector
                        onClassChange={setSelectedClass}
                        onSubjectChange={setSelectedSubject}
                        onBookChange={setSelectedBook}
                        onChapterChange={setSelectedChapter}
                        onTopicChange={setSelectedTopic}
                        required
                    />

                    <DragDropUpload onUpload={async (files) => {
                        if (files.length > 0) {
                            setFile(files[0])
                            setParsing(true)

                            try {
                                const fileToUpload = files[0]
                                const formData = new FormData()
                                formData.append('file', fileToUpload)
                                formData.append('class_id', selectedClass)
                                formData.append('subject_id', selectedSubject)
                                formData.append('chapter_id', selectedChapter)
                                formData.append('topic_id', selectedTopic)

                                const result = await parseDocxAction(formData)

                                if (!result.success) {
                                    throw new Error(result.error)
                                }

                                // Redirect to review page
                                router.push(`/admin/content/upload/review/${result.uploadId}`)

                            } catch (error: any) {
                                console.error('Error:', error)
                                alert('Failed to process file: ' + error.message)
                            } finally {
                                setParsing(false)
                            }
                        }
                    }} />
                </div>
            </div>
        </div>
    )
}
