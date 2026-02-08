
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
