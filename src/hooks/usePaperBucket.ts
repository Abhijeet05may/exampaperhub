import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Question {
    id: string
    question_text: string
    options?: {
        [key: string]: string
    }
    correct_answer?: string
    explanation?: string
    difficulty?: string
    image_url?: string
    topics?: { name: string }
    subjects?: { name: string }
    chapters?: { name: string }
}

interface PaperBucketState {
    questions: Question[]
    addQuestion: (question: Question) => void
    removeQuestion: (questionId: string) => void
    clearBucket: () => void
    isInBucket: (questionId: string) => boolean
    reorderQuestions: (startIndex: number, endIndex: number) => void
}

export const usePaperBucket = create<PaperBucketState>()(
    persist(
        (set, get) => ({
            questions: [],
            addQuestion: (question) => set((state) => {
                if (state.questions.some(q => q.id === question.id)) return state
                return { questions: [...state.questions, question] }
            }),
            removeQuestion: (id) => set((state) => ({
                questions: state.questions.filter((q) => q.id !== id),
            })),
            clearBucket: () => set({ questions: [] }),
            isInBucket: (id) => get().questions.some((q) => q.id === id),
            reorderQuestions: (startIndex, endIndex) => set((state) => {
                const result = Array.from(state.questions)
                const [removed] = result.splice(startIndex, 1)
                result.splice(endIndex, 0, removed)
                return { questions: result }
            })
        }),
        {
            name: 'paper-bucket-storage',
        }
    )
)
