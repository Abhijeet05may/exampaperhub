
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(prevState: any, formData: FormData) {
    const supabase = createClient()
    const name = formData.get('name') as string
    const type = formData.get('type') as string // 'classes', 'subjects', etc.
    const parentId = formData.get('parentId') as string

    if (!name || !type) {
        return { message: 'Name and Type are required' }
    }

    const payload: any = { name }

    // Logic to handle parent referencing depending on type hierarchy
    if (type === 'subjects' && parentId) payload.class_id = parentId
    if (type === 'chapters' && parentId) payload.subject_id = parentId
    if (type === 'topics' && parentId) payload.chapter_id = parentId

    const { error } = await supabase.from(type).insert(payload)

    if (error) {
        return { message: 'Failed to create category: ' + error.message }
    }

    revalidatePath('/admin/categories')
    return { message: 'Category created successfully' }
}

export async function deleteCategory(type: string, id: string) {
    const supabase = createClient()
    const { error } = await supabase.from(type).delete().eq('id', id)
    if (error) throw error
    revalidatePath('/admin/categories')
}

export async function createQuestion(formData: FormData) {
    const supabase = createClient()

    const question_text = formData.get('question_text') as string
    const option_a = formData.get('option_a') as string
    const option_b = formData.get('option_b') as string
    const option_c = formData.get('option_c') as string
    const option_d = formData.get('option_d') as string
    const correct_answer = formData.get('correct_answer') as string
    const difficulty = formData.get('difficulty') as string
    const explanation = formData.get('explanation') as string

    const class_id = formData.get('class_id') as string
    const subject_id = formData.get('subject_id') as string
    const chapter_id = formData.get('chapter_id') as string
    const topic_id = formData.get('topic_id') as string
    const image_url = formData.get('image_url') as string

    if (!question_text || !correct_answer || !class_id) {
        throw new Error('Missing required fields')
    }

    const { error } = await supabase.from('questions').insert({
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        difficulty,
        explanation,
        class_id,
        subject_id,
        chapter_id,
        topic_id,
        image_url,
        status: formData.get('status') || 'draft'
    })

    if (error) {
        console.error('Error creating question:', error)
        throw new Error('Failed to create question')
    }

    revalidatePath('/admin/content/questions')
    redirect('/admin/content/questions')
}

export async function deleteQuestion(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/admin/content/questions')
}

export async function savePaperData(name: string, questionIds: string[]) {
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('saved_papers').insert({
        user_id: user.id,
        title: name,
        questions: questionIds, // Storing as JSON array
        created_at: new Date().toISOString()
    })

    if (error) {
        console.error('Error saving paper:', error)
        throw new Error('Failed to save paper')
    }

    revalidatePath('/saved-papers')
    return { success: true }
}

export async function reviewQuestion(questionId: string, status: 'approved' | 'rejected', feedback?: string) {
    const supabase = createClient()

    const updateData: any = { status }
    if (feedback) updateData.feedback = feedback // Assuming a feedback column exists or we store it in metadata

    const { error } = await supabase
        .from('questions')
        .update(updateData)
        .eq('id', questionId)

    if (error) {
        throw new Error('Failed to update review status')
    }

    revalidatePath('/admin/content/review')
}
