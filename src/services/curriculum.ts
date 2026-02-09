import { createBrowserClient } from '@supabase/ssr'
import { NodeType, CurriculumNode } from '@/components/admin/curriculum/types'

const getSupabase = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const curriculumService = {
    // Check if we are connected by a simple fetch
    async healthCheck() {
        const { error } = await getSupabase().from('classes').select('count', { count: 'exact', head: true })
        return !error
    },

    // 1. Fetch all Classes (for the Context Switcher)
    async getClasses() {
        const { data, error } = await getSupabase()
            .from('classes')
            .select('*')
            .order('name')
        if (error) throw error
        return data || []
    },

    // 2. Fetch Hierarchy for a specific Class
    // We'll fetch Subjects -> Books -> Chapters -> Topics for the given class_id
    // This might be heavy, but for a typical class curriculum it's manageable (e.g. 5 subjects * 2 books * 15 chapters)
    async getClassHierarchy(classId: string): Promise<CurriculumNode[]> {
        // Fetch Subjects
        const { data: subjects, error: subjError } = await getSupabase()
            .from('subjects')
            .select(`
                id, name,
                books (
                    id, name,
                    chapters (
                        id, name,
                        topics (
                            id, name
                        )
                    )
                )
            `)
            .eq('class_id', classId)
            .order('name')

        if (subjError) throw subjError

        // Transform to CurriculumNode structure
        return subjects.map((subj: any) => ({
            id: subj.id,
            title: subj.name,
            type: 'subject',
            children: subj.books?.map((book: any) => ({
                id: book.id,
                title: book.name,
                type: 'book',
                parentId: subj.id,
                children: book.chapters?.map((chap: any) => ({
                    id: chap.id,
                    title: chap.name,
                    type: 'chapter',
                    parentId: book.id,
                    children: chap.topics?.map((top: any) => ({
                        id: top.id,
                        title: top.name,
                        type: 'topic',
                        parentId: chap.id
                    }))
                }))
            }))
        }))
    },

    // 3. Create Entity
    async createEntity(type: NodeType, data: { name: string, parentId?: string }) {
        let table = ''
        let payload: any = { name: data.name }

        switch (type) {
            case 'class':
                table = 'classes'
                break
            case 'subject':
                table = 'subjects'
                payload.class_id = data.parentId
                break
            case 'book':
                table = 'books'
                payload.subject_id = data.parentId
                break
            case 'chapter':
                table = 'chapters'
                payload.book_id = data.parentId
                break
            case 'topic':
                table = 'topics'
                payload.chapter_id = data.parentId
                break
        }

        const { data: result, error } = await getSupabase()
            .from(table)
            .insert(payload)
            .select()
            .single()

        if (error) throw error
        return result
    },

    // 4. Delete Entity
    async deleteEntity(type: NodeType, id: string) {
        let table = ''
        switch (type) {
            case 'class': table = 'classes'; break
            case 'subject': table = 'subjects'; break
            case 'book': table = 'books'; break
            case 'chapter': table = 'chapters'; break
            case 'topic': table = 'topics'; break
        }

        const { error } = await getSupabase().from(table).delete().eq('id', id)
        if (error) throw error
    },

    // 5. Update Entity
    async updateEntity(type: NodeType, id: string, data: { name?: string, description?: string }) {
        let table = ''
        switch (type) {
            case 'class': table = 'classes'; break
            case 'subject': table = 'subjects'; break
            case 'book': table = 'books'; break
            case 'chapter': table = 'chapters'; break
            case 'topic': table = 'topics'; break
        }

        const payload: any = {}
        if (data.name) payload.name = data.name
        // Description updates if table supports it (mock for now if not in schema)

        const { error } = await getSupabase().from(table).update(payload).eq('id', id)
        if (error) throw error
    }
}
