
import { create } from 'zustand'

export interface Question {
    id: string
    question_text: string
    difficulty: string
    image_url?: string
    [key: string]: any
}

interface PaperBucketState {
    questions: Question[]
    isOpen: boolean
    addQuestion: (question: Question) => void
    removeQuestion: (id: string) => void
    clearBucket: () => void
    toggleBucket: () => void
    setBucketOpen: (isOpen: boolean) => void
}

export const usePaperBucket = create<PaperBucketState>((set) => ({
    questions: [],
    isOpen: false,
    addQuestion: (question) => set((state) => {
        if (state.questions.some(q => q.id === question.id)) return state
        return { questions: [...state.questions, question], isOpen: true }
    }),
    removeQuestion: (id) => set((state) => ({
        questions: state.questions.filter(q => q.id !== id)
    })),
    clearBucket: () => set({ questions: [] }),
    toggleBucket: () => set((state) => ({ isOpen: !state.isOpen })),
    setBucketOpen: (isOpen) => set({ isOpen })
}))
