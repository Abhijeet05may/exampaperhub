
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ... existing category actions ...
export async function createClass(formData: FormData) {
    const supabase = createClient()
    const name = formData.get('name') as string
    const { error } = await supabase.from('classes').insert({ name })
    if (error) throw error
    revalidatePath('/admin/categories')
}

export async function createSubject(formData: FormData) {
    const supabase = createClient()
    const name = formData.get('name') as string
    const classId = formData.get('classId') as string
    const { error } = await supabase.from('subjects').insert({ name, class_id: classId })
    if (error) throw error
    revalidatePath('/admin/categories')
}

export async function createChapter(formData: FormData) {
    const supabase = createClient()
    const name = formData.get('name') as string
    const subjectId = formData.get('subjectId') as string
    const { error } = await supabase.from('chapters').insert({ name, subject_id: subjectId })
    if (error) throw error
    revalidatePath('/admin/categories')
}

export async function createTopic(formData: FormData) {
    const supabase = createClient()
    const name = formData.get('name') as string
    const chapterId = formData.get('chapterId') as string
    const { error } = await supabase.from('topics').insert({ name, chapter_id: chapterId })
    if (error) throw error
    revalidatePath('/admin/categories')
}

export async function deleteCategory(type: 'classes' | 'subjects' | 'chapters' | 'topics', id: string) {
    const supabase = createClient()
    const { error } = await supabase.from(type).delete().eq('id', id)
    if (error) throw error
    revalidatePath('/admin/categories')
}

// Question Actions
export async function createQuestion(formData: FormData) {
    const supabase = createClient()

    const question = {
        question_text: formData.get('question_text') as string,
        option_a: formData.get('option_a') as string,
        option_b: formData.get('option_b') as string,
        option_c: formData.get('option_c') as string,
        option_d: formData.get('option_d') as string,
        correct_answer: formData.get('correct_answer') as string,
        explanation: formData.get('explanation') as string,
        difficulty: formData.get('difficulty') as string,
        class_id: formData.get('class_id') as string,
        subject_id: formData.get('subject_id') as string,
        chapter_id: formData.get('chapter_id') as string,
        topic_id: formData.get('topic_id') as string,
        image_url: formData.get('image_url') as string || null,
    }

    const { error } = await supabase.from('questions').insert(question)

    if (error) {
        console.error('Error creating question:', error)
        throw error
    }

    revalidatePath('/admin/questions')
    redirect('/admin/questions')
}

export async function deleteQuestion(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/admin/questions')
}
