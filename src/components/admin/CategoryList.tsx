
'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface BaseCategory {
    id: string
    name: string
}

interface CategoryWithParent extends BaseCategory {
    classes?: BaseCategory
    subjects?: BaseCategory
    chapters?: BaseCategory
}

interface CategoryListProps {
    title: string
    type: string
    data: CategoryWithParent[]
    parents?: BaseCategory[]
    parentLabel?: string
}

export default function CategoryList({ title, type, data, parents, parentLabel }: CategoryListProps) {
    const [loading, setLoading] = useState(false)
    const [newItem, setNewItem] = useState('')
    const [selectedParent, setSelectedParent] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItem.trim()) return
        if (parents && parents.length > 0 && !selectedParent) return

        setLoading(true)
        try {
            const payload: any = { name: newItem }

            // Map parent ID based on type
            if (type === 'subjects') payload.class_id = selectedParent
            if (type === 'chapters') payload.subject_id = selectedParent
            if (type === 'topics') payload.chapter_id = selectedParent

            const { error } = await supabase.from(type).insert(payload)
            if (error) throw error

            setNewItem('')
            router.refresh()
        } catch (error) {
            console.error('Error adding item:', error)
            alert('Failed to add item')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all child items too.')) return

        try {
            const { error } = await supabase.from(type).delete().eq('id', id)
            if (error) throw error
            router.refresh()
        } catch (error) {
            console.error('Error deleting item:', error)
            alert('Failed to delete item')
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

            <form onSubmit={handleAdd} className="space-y-3 mb-6">
                {parents && parents.length > 0 && (
                    <select
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                    >
                        <option value="">Select {parentLabel}</option>
                        {parents.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder={`New ${title.slice(0, -1)} name`}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </form>

            <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {data.length === 0 ? (
                    <li className="py-2 text-sm text-gray-500 text-center">No items yet</li>
                ) : (
                    data.map((item) => (
                        <li key={item.id} className="py-2 flex justify-between items-center group">
                            <div>
                                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                {/* Show parent name if applicable */}
                                {type === 'subjects' && item.classes && (
                                    <span className="ml-2 text-xs text-gray-400">({item.classes.name})</span>
                                )}
                                {type === 'chapters' && item.subjects && (
                                    <span className="ml-2 text-xs text-gray-400">({item.subjects.name})</span>
                                )}
                                {type === 'topics' && item.chapters && (
                                    <span className="ml-2 text-xs text-gray-400">({item.chapters.name})</span>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}
