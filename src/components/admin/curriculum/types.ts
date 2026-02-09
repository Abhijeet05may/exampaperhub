export type NodeType = 'class' | 'subject' | 'book' | 'chapter' | 'topic'

export interface CurriculumNode {
    id: string
    title: string
    type: NodeType
    parentId?: string
    children?: CurriculumNode[]
    metadata?: {
        questionsCount?: number
        code?: string
        status?: 'active' | 'archived' | 'draft'
        lastUpdated?: string
        description?: string
    }
}
