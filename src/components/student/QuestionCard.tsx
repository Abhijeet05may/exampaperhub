
import { Check, Plus, AlertCircle } from 'lucide-react'

interface QuestionCardProps {
    question: any
    onAddToPaper?: (question: any) => void
    isSelected?: boolean
}

export default function QuestionCard({ question, onAddToPaper, isSelected }: QuestionCardProps) {
    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'bg-green-100 text-green-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'hard': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'hover:border-gray-300'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {question.chapters?.name}
                    </span>
                </div>
                <button
                    onClick={() => onAddToPaper && onAddToPaper(question)}
                    disabled={isSelected}
                    className={`inline-flex items-center p-1.5 rounded-md text-sm font-medium transition-colors ${isSelected
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                >
                    {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
            </div>

            <div className="prose prose-sm max-w-none text-gray-900 mb-4">
                <p>{question.question_text}</p>

                {question.image_url && (
                    <div className="mt-2 text-center bg-gray-50 rounded-lg p-2">
                        <img
                            src={question.image_url}
                            alt="Question Diagram"
                            className="max-h-48 mx-auto rounded overflow-hidden"
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-start">
                    <span className="font-bold min-w-[1.5rem]">A.</span>
                    <span>{question.option_a}</span>
                </div>
                <div className="flex items-start">
                    <span className="font-bold min-w-[1.5rem]">B.</span>
                    <span>{question.option_b}</span>
                </div>
                <div className="flex items-start">
                    <span className="font-bold min-w-[1.5rem]">C.</span>
                    <span>{question.option_c}</span>
                </div>
                <div className="flex items-start">
                    <span className="font-bold min-w-[1.5rem]">D.</span>
                    <span>{question.option_d}</span>
                </div>
            </div>
        </div>
    )
}
