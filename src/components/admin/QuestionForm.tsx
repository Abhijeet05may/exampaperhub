'use client'

import { useState } from 'react'
import { createQuestion } from '@/app/(admin)/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import CategorySelector from "./CategorySelector"
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import { Loader2, UploadCloud } from 'lucide-react'

export default function QuestionForm() {
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `questions/${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('question-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from('question-images')
                .getPublicUrl(filePath)

            setImageUrl(data.publicUrl)
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Question Details</h3>
                <CategorySelector required />
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="question_text">Question Text</Label>
                    <RichTextEditor
                        value={formData.question_text}
                        onChange={(value) => setFormData({ ...formData, question_text: value })}
                    />
                </div>

                <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <RichTextEditor
                        value={formData.explanation}
                        onChange={(value) => setFormData({ ...formData, explanation: value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['A', 'B', 'C', 'D'].map((opt) => (
                    <div key={opt}>
                        <label className="block text-sm font-medium text-gray-700">Option {opt}</label>
                        <input
                            type="text"
                            name={`option_${opt.toLowerCase()}`}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                    <select
                        name="correct_answer"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    >
                        <option value="">Select Answer</option>
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <select
                        name="difficulty"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
                <div className="mt-1 flex items-center space-x-4">
                    <input
                        type="hidden"
                        name="image_url"
                        value={imageUrl}
                    />
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        <span>Upload Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    {uploading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                    {imageUrl && (
                        <div className="relative h-16 w-16">
                            <img src={imageUrl} alt="Uploaded" className="h-full w-full object-cover rounded-md border" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        defaultValue="draft"
                    >
                        <option value="draft">Save as Draft</option>
                        <option value="review">Submit for Review</option>
                        {/* Admin override could go here if we check roles */}
                        <option value="approved">Directly Approve (Admin)</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Question
                </button>
            </div>
        </form>
    )
}
