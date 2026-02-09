
import { createClient } from '@/lib/supabase/server'
import CategoryList from '@/components/admin/CategoryList'
import { Plus } from 'lucide-react'

export default async function CategoriesPage() {
    const supabase = createClient()

    const { data: classes } = await supabase.from('classes').select('*').order('name')
    const { data: subjects } = await supabase.from('subjects').select('*, classes(name)').order('name')
    const { data: books } = await supabase.from('books').select('*, subjects(name)').order('name')
    const { data: chapters } = await supabase.from('chapters').select('*, subjects(name), books(name)').order('name')
    const { data: topics } = await supabase.from('topics').select('*, chapters(name)').order('name')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Category Management</h1>
            </div>

            <CategoryList
                title="Classes"
                type="classes"
                data={classes || []}
                parents={[]}
            />
            <CategoryList
                title="Subjects"
                type="subjects"
                data={subjects || []}
                parents={classes || []}
                parentLabel="Class"
            />
            <CategoryList
                title="Books"
                type="books"
                data={books || []}
                parents={subjects || []}
                parentLabel="Subject"
            />
            <CategoryList
                title="Chapters"
                type="chapters"
                data={chapters || []}
                parents={books && books.length > 0 ? books : subjects || []}
                parentLabel={books && books.length > 0 ? "Book" : "Subject"}
            />
            <CategoryList
                title="Topics"
                type="topics"
                data={topics || []}
                parents={chapters || []}
                parentLabel="Chapter"
            />
        </div>
    )
}
