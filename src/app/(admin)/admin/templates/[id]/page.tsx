import { TemplateEditor } from '@/components/admin/templates/TemplateEditor'

export default function TemplateEditPage({ params }: { params: { id: string } }) {
    return (
        <TemplateEditor templateId={params.id} />
    )
}
