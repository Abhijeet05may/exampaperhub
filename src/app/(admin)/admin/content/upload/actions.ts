'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function parseDocxAction(formData: FormData) {
    const supabase = createClient()
    const file = formData.get('file') as File
    const class_id = formData.get('class_id') as string
    const subject_id = formData.get('subject_id') as string
    const chapter_id = formData.get('chapter_id') as string
    const topic_id = formData.get('topic_id') as string

    if (!file) {
        return { success: false, error: 'No file provided' }
    }

    try {
        // 1. Create Upload Record
        const { data: uploadRecord, error: uploadError } = await supabase
            .from('docx_uploads')
            .insert({
                filename: file.name,
                status: 'processing',
                // uploaded_by is handled by RLS or default value, or we fetch user here
            })
            .select()
            .single()

        if (uploadError) {
            console.error('Upload record error:', uploadError)
            return { success: false, error: 'Failed to create upload record' }
        }

        // 2. Simulate Parsing (Mocking the AI/Regex extraction)
        await new Promise(resolve => setTimeout(resolve, 2000)) // 2s delay

        // Mock Data extraction
        const mockQuestions = [
            {
                question_text: 'What is the powerhouse of the cell?',
                option_a: 'Nucleus',
                option_b: 'Mitochondria',
                option_c: 'Ribosome',
                option_d: 'Golgi Apparatus',
                correct_answer: 'B',
                difficulty: 'Easy',
                explanation: 'Mitochondria generate most of the chemical energy needed to power the cell\'s biochemical reactions.'
            },
            {
                question_text: 'Which planet is known as the Red Planet?',
                option_a: 'Venus',
                option_b: 'Mars',
                option_c: 'Jupiter',
                option_d: 'Saturn',
                correct_answer: 'B',
                difficulty: 'Easy',
                explanation: 'Mars appears red due to iron oxide on its surface.'
            },
            {
                question_text: 'What is the chemical symbol for Gold?',
                option_a: 'Au',
                option_b: 'Ag',
                option_c: 'Fe',
                option_d: 'Pb',
                correct_answer: 'A',
                difficulty: 'Medium',
                explanation: 'Au comes from the Latin word for gold, "Aurum".'
            },
            {
                question_text: 'Who wrote "Romeo and Juliet"?',
                option_a: 'Charles Dickens',
                option_b: 'William Shakespeare',
                option_c: 'Mark Twain',
                option_d: 'Jane Austen',
                correct_answer: 'B',
                difficulty: 'Easy',
                explanation: 'Shakespeare wrote this tragedy early in his career.'
            },
            {
                question_text: 'What is the speed of light?',
                option_a: '300,000 km/s',
                option_b: '150,000 km/s',
                option_c: '1,000 km/s',
                option_d: 'Sound speed',
                correct_answer: 'A',
                difficulty: 'Hard',
                explanation: 'Light travels at approximately 299,792,458 meters per second.'
            }
        ]

        // 3. Insert Questions linked to Upload ID
        const questionsToInsert = mockQuestions.map(q => ({
            ...q,
            class_id,
            subject_id,
            chapter_id,
            topic_id,
            status: 'pending_review', // Important: Pending Review
            upload_id: uploadRecord.id,
            created_at: new Date().toISOString()
        }))

        const { error: insertError } = await supabase
            .from('questions')
            .insert(questionsToInsert)

        if (insertError) {
            console.error('Insert questions error:', insertError)
            // Update upload status to failed
            await supabase.from('docx_uploads').update({ status: 'failed' }).eq('id', uploadRecord.id)
            return { success: false, error: 'Failed to save extracted questions' }
        }

        // 4. Update Upload Status to Completed
        await supabase
            .from('docx_uploads')
            .update({ status: 'completed' })
            .eq('id', uploadRecord.id)

        revalidatePath('/admin/content/processing')
        return { success: true, uploadId: uploadRecord.id }

    } catch (error: any) {
        console.error('Server Action Error:', error)
        return { success: false, error: error.message || 'Unknown error' }
    }
}
