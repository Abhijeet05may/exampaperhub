
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CategorySelector from '@/components/admin/CategorySelector'
import { UploadCloud, FileText, Loader2, Check, AlertCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'

export default function DocxUploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [parsing, setParsing] = useState(false)
    const [parsedQuestions, setParsedQuestions] = useState<any[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [selectedChapter, setSelectedChapter] = useState('')
    const [selectedTopic, setSelectedTopic] = useState('')
    const [saving, setSaving] = useState(false)

    const supabase = createClient()
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleParse = async () => {
        if (!file) return
        setParsing(true)
        setParsedQuestions([])

        try {
            // 1. Upload file to temp storage (optional, or send directly to edge function)
            // Sending directly to edge function is better for parsing without storing potentially bad files

            const formData = new FormData()
            formData.append('file', file)

            // Call Edge Function
            const { data, error } = await supabase.functions.invoke('parse-docx', {
                body: formData,
            })

            if (error) throw error

            if (data && data.questions) {
                setParsedQuestions(data.questions)
            }

        } catch (error) {
            console.error('Error parsing DOCX:', error)
            alert('Failed to parse DOCX file.')
        } finally {
            setParsing(false)
        }
    }

    const handleSaveAll = async () => {
        if (parsedQuestions.length === 0) return
        if (!selectedClass || !selectedSubject || !selectedChapter || !selectedTopic) {
            alert('Please select all categories before saving.')
            return
        }

        setSaving(true)
        try {
            const questionsToInsert = parsedQuestions.map(q => ({
                ...q,
                class_id: selectedClass,
                subject_id: selectedSubject,
                chapter_id: selectedChapter,
                topic_id: selectedTopic,
                // If images were extracted, they should already be uploaded by the Edge Function 
                // and URL returned in q.image_url
            }))

            const { error } = await supabase.from('questions').insert(questionsToInsert)
            if (error) throw error

            alert('Questions saved successfully!')
            router.push('/admin/questions')
        } catch (error) {
            console.error('Error saving questions:', error)
            alert('Failed to save questions.')
        } finally {
            setSaving(false)
        }
    }

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
                        onChapterChange={setSelectedChapter}
                        onTopicChange={setSelectedTopic}
                        required
                    />

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-500 transition-colors">
                        <input
                            type="file"
                            id="docx-upload"
                            accept=".docx"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="docx-upload" className="cursor-pointer flex flex-col items-center justify-center">
                            <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                            <span className="text-lg font-medium text-gray-900">
                                {file ? file.name : 'Click to select DOCX file'}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">Accepts .docx files only</span>
                        </label>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleParse}
                            disabled={!file || parsing}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {parsing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Parsing...
                                </>
                            ) : (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Parse Questions
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {parsedQuestions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Review Parsed Questions ({parsedQuestions.length})</h2>
                        <button
                            onClick={handleSaveAll}
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Save All Questions
                        </button>
                    </div>

                    <div className="space-y-6">
                        {parsedQuestions.map((q, idx) => (
                            <div key={idx} className="border rounded-md p-4 bg-gray-50">
                                <div className="flex gap-4">
                                    <span className="font-bold text-gray-500">Q{idx + 1}.</span>
                                    <div className="flex-1 space-y-2">
                                        <p className="font-medium">{q.question_text}</p>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {['A', 'B', 'C', 'D'].map(opt => (
                                                <div key={opt} className={`p-2 rounded ${q.correct_answer === opt ? 'bg-green-100 border-green-200 border' : 'bg-white border'}`}>
                                                    <span className="font-bold mr-2">{opt}:</span>
                                                    {q[`option_${opt.toLowerCase()}`]}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            <span className="font-semibold">Explanation:</span> {q.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
