
'use client'

import QuestionCard from './QuestionCard'
import { FolderOpen } from 'lucide-react'

interface QuestionListProps {
    initialQuestions: any[]
}

export default function QuestionList({ initialQuestions }: QuestionListProps) {
    if (!initialQuestions || initialQuestions.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {initialQuestions.map((q) => (
                <QuestionCard
                    key={q.id}
                    question={q}
                />
            ))}
        </div>
    )
}
