import { QuestionEditor } from '@/components/admin/questions/QuestionEditor'

export default function QuestionEditorPage({ params }: { params: { id: string } }) {
    return (
        <QuestionEditor questionId={params.id} />
    )
}
