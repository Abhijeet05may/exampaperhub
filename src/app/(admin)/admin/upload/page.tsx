
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CategorySelector from '@/components/admin/CategorySelector'
import { UploadCloud, FileText, Loader2, Check, AlertCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { DragDropUpload } from '@/components/admin/upload/DragDropUpload'

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

                                // 1. Create upload record
                                const { data: uploadRecord, error: uploadError } = await supabase
                                    .from('docx_uploads')
                                    .insert({
                                        filename: fileToUpload.name,
                                        status: 'processing',
                                        uploaded_by: (await supabase.auth.getUser()).data.user?.id
                                    })
                                    .select()
                                    .single()

                                if (uploadError) throw new Error('Failed to track upload')

                                // 2. Parse (Edge Function should handle images and return structured data)
                                const { data, error } = await supabase.functions.invoke('parse-docx', {
                                    body: formData,
                                })

                                if (error) throw error

                                if (data && data.questions) {
                                    // 3. Insert questions linked to upload_id
                                    const questionsToInsert = data.questions.map((q: any) => ({
                                        ...q,
                                        class_id: selectedClass,
                                        subject_id: selectedSubject,
                                        chapter_id: selectedChapter,
                                        topic_id: selectedTopic,
                                        status: 'approved', // Auto-approve for now, or 'pending' if we want another step
                                        upload_id: uploadRecord.id
                                    }))

                                    const { error: insertError } = await supabase.from('questions').insert(questionsToInsert)
                                    if (insertError) throw insertError

                                    // Redirect to review page
                                    router.push(`/admin/upload/review/${uploadRecord.id}`)
                                }

                            } catch (error) {
                                console.error('Error:', error)
                                alert('Failed to process file.')
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
