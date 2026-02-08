
'use client'

import { usePaperBucket } from '@/store/paperBucket'
import { X, Trash2, FileText, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { savePaperData } from '@/app/(admin)/actions'
import { useToast } from '@/components/ui/use-toast'

export default function BucketSidebar() {
    const { questions, isOpen, removeQuestion, clearBucket, toggleBucket } = usePaperBucket()
    const [mounted, setMounted] = useState(false)
    const [paperTitle, setPaperTitle] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const { toast } = useToast()

    // Hydration fix for persistent state if we add it later, 
    // also good practice for client-side only components
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
                    onClick={toggleBucket}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-4 py-4 border-b bg-indigo-600 text-white flex justify-between items-center">
                        <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            <h2 className="font-semibold text-lg">Paper Bucket ({questions.length})</h2>
                        </div>
                        <button onClick={toggleBucket} className="text-indigo-100 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {questions.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>No questions selected.</p>
                                <p className="text-sm mt-2">Browse questions and click "+" to add them here.</p>
                            </div>
                        ) : (
                            questions.map((q, idx) => (
                                <div key={q.id} className="bg-gray-50 p-3 rounded-md border border-gray-200 relative group">
                                    <span className="absolute top-2 left-2 text-xs font-bold text-gray-400">#{idx + 1}</span>
                                    <button
                                        onClick={() => removeQuestion(q.id)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <p className="text-sm text-gray-800 mt-4 line-clamp-3">{q.question_text}</p>
                                    <div className="mt-2 text-xs text-gray-500 flex gap-2">
                                        <span className="bg-gray-200 px-1.5 py-0.5 rounded">{q.difficulty}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t bg-gray-50 space-y-3">
                        {showSaveDialog ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                <input
                                    type="text"
                                    placeholder="Enter paper title..."
                                    value={paperTitle}
                                    onChange={(e) => setPaperTitle(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowSaveDialog(false)}
                                        className="flex-1 px-3 py-1.5 border text-gray-600 rounded text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!paperTitle.trim()) return
                                            setIsSaving(true)
                                            try {
                                                await savePaperData(paperTitle, questions.map(q => q.id))
                                                toast({ title: "Success", description: "Paper saved successfully." })
                                                setPaperTitle('')
                                                setShowSaveDialog(false)
                                                // clearBucket() // Optional: keep bucket or clear?
                                            } catch (e) {
                                                toast({ title: "Error", description: "Failed to save paper.", variant: "destructive" })
                                            } finally {
                                                setIsSaving(false)
                                            }
                                        }}
                                        disabled={isSaving || !paperTitle.trim()}
                                        className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Confirm Save'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={clearBucket}
                                    disabled={questions.length === 0}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => setShowSaveDialog(true)}
                                    disabled={questions.length === 0}
                                    className="flex-2 flex-grow px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center"
                                >
                                    Save Paper
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >

            {/* Toggle Button (Visible when closed) */ }
    {
        !isOpen && questions.length > 0 && (
            <button
                onClick={toggleBucket}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-40 animate-bounce"
            >
                <FileText className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {questions.length}
                </span>
            </button>
        )
    }
        </>
    )
}
