"use client"

import { useState, useEffect, useCallback } from "react"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { CurriculumTree } from "./CurriculumTree"
import { EntityBrowser } from "./EntityBrowser"
import { EntityDetails } from "./EntityDetails"
import { CurriculumNode, NodeType } from "./types"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload, Loader2, RefreshCw } from "lucide-react"
import { ClassSelector } from "./ClassSelector"
import { AddEntityDialog } from "./AddEntityDialog"
import { curriculumService } from "@/services/curriculum"
import { useToast } from "@/components/ui/use-toast"
import { CommandBar } from "./CommandBar"

// Helper to generate breadcrumbs (Mock for now, normally requires parent traversal)
const getBreadcrumbs = (node: CurriculumNode | null) => {
    const crumbs = [{ id: 'root', title: 'Root', type: 'root' }]
    if (node) {
        // In a real app we'd traverse parents. Here we just show the active node.
        crumbs.push({ id: node.id, title: node.title, type: node.type })
    }
    return crumbs
}

export default function CurriculumWorkspace() {
    const { toast } = useToast()
    // Data State
    const [classes, setClasses] = useState<{ id: string, name: string }[]>([])
    const [selectedClassId, setSelectedClassId] = useState<string>("")
    const [treeData, setTreeData] = useState<CurriculumNode[]>([])

    // UI State
    const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // Dialog State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [addDialogType, setAddDialogType] = useState<NodeType>('class')
    const [addDialogParent, setAddDialogParent] = useState<{ id: string, name: string } | undefined>(undefined)

    // 1. Fetch Classes on Mount
    const fetchClasses = useCallback(async () => {
        try {
            const data = await curriculumService.getClasses()
            setClasses(data)
            if (data.length > 0 && !selectedClassId) {
                // Auto-select first class if none selected
                setSelectedClassId(data[0].id)
            }
            // Auto-select newly created class if it matches
        } catch (error) {
            console.error("Failed to fetch classes", error)
            toast({ title: "Error", description: "Failed to load classes", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }, [selectedClassId])

    useEffect(() => {
        fetchClasses()
    }, [fetchClasses])

    // 2. Fetch Hierarchy when Class changes
    const fetchHierarchy = useCallback(async (classId: string) => {
        if (!classId) return
        setRefreshing(true)
        try {
            const data = await curriculumService.getClassHierarchy(classId)
            setTreeData(data)
            setSelectedNode(null) // Reset selection on class switch
        } catch (error) {
            console.error("Failed to fetch hierarchy", error)
            toast({ title: "Error", description: "Failed to load curriculum hierarchy", variant: "destructive" })
        } finally {
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        if (selectedClassId) {
            fetchHierarchy(selectedClassId)
        }
    }, [selectedClassId, fetchHierarchy])

    // Handlers
    const handleAddClass = () => {
        setAddDialogType('class')
        setAddDialogParent(undefined)
        setIsAddDialogOpen(true)
    }

    const handleAddChild = (type: NodeType, parentNode?: CurriculumNode) => {
        setAddDialogType(type)
        if (parentNode) {
            setAddDialogParent({ id: parentNode.id, name: parentNode.title })
        } else if (type === 'subject') {
            // Adding subject to current class
            const currentClass = classes.find(c => c.id === selectedClassId)
            if (currentClass) {
                setAddDialogParent({ id: currentClass.id, name: currentClass.name })
            }
        }
        setIsAddDialogOpen(true)
    }

    const handleCreateEntity = async (name: string) => {
        try {
            // Determine parent ID based on type
            let parentId = addDialogParent?.id

            // Special case: If adding subject, parent is the *current class*
            if (addDialogType === 'subject' && !parentId) {
                parentId = selectedClassId
            }

            if (addDialogType !== 'class' && !parentId) {
                toast({ title: "Error", description: "Parent context missing", variant: "destructive" })
                return
            }

            await curriculumService.createEntity(addDialogType, { name, parentId })

            toast({ title: "Success", description: `${addDialogType} created successfully` })

            // Refresh data
            if (addDialogType === 'class') {
                fetchClasses()
            } else {
                fetchHierarchy(selectedClassId)
            }
        } catch (error) {
            console.error("Create failed", error)
            toast({ title: "Error", description: "Failed to create item", variant: "destructive" })
        }
    }

    const handleTreeAction = async (action: string, node: CurriculumNode, data?: any) => {
        try {
            switch (action) {
                case 'delete':
                    if (confirm(`Are you sure you want to delete ${node.title}?`)) {
                        await curriculumService.deleteEntity(node.type, node.id)
                        toast({ title: "Deleted", description: `${node.title} has been deleted.` })
                        if (selectedNode?.id === node.id) setSelectedNode(null)
                        refreshData()
                    }
                    break
                case 'bulk-delete':
                    if (data?.ids && data.ids.length > 0) {
                        if (confirm(`Delete ${data.ids.length} items?`)) {
                            const promises = data.ids.map(async (id: string) => {
                                const child = node.children?.find(c => c.id === id)
                                if (child) {
                                    return curriculumService.deleteEntity(child.type, child.id)
                                }
                            })
                            await Promise.all(promises)
                            toast({ title: "Bulk Delete", description: `Deleted ${data.ids.length} items.` })
                            refreshData()
                        }
                    }
                    break
                case 'rename':
                    if (data?.newTitle) {
                        await curriculumService.updateEntity(node.type, node.id, { name: data.newTitle })
                        toast({ title: "Updated", description: "Item renamed successfully." })
                        refreshData()
                    }
                    break
                case 'add-subject':
                    handleAddChild('subject', data?.node)
                    break
                case 'add-book':
                    handleAddChild('book', node)
                    break
                case 'add-chapter':
                    handleAddChild('chapter', node)
                    break
                case 'add-topic':
                    handleAddChild('topic', node)
                    break
                case 'duplicate':
                case 'archive':
                case 'bulk-move':
                    toast({ title: "Coming Soon", description: `${action} functionality is under construction.` })
                    break
                default:
                    console.warn("Unknown tree action:", action)
            }
        } catch (error) {
            console.error("Action failed:", error)
            toast({ variant: "destructive", title: "Action Failed", description: "Could not complete the requested action." })
        }
    }

    const refreshData = () => {
        if (selectedClassId) fetchHierarchy(selectedClassId)
        fetchClasses()
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Command Bar (New Top Toolbar) */}
            <CommandBar
                breadcrumbs={getBreadcrumbs(selectedNode)}
                onNavigate={(id) => {
                    if (!id) {
                        setSelectedNode(null)
                    } else {
                        // Find node in tree (BFS or recursive search needed in real app)
                        // For now we just reset if root, or keep selection if same.
                        // Ideally `fetchHierarchy` handles this.
                        if (id === 'root') setSelectedNode(null)
                    }
                }}
                onSearch={(q) => console.log("Search", q)}
                onUndo={() => toast({ title: "Undo", description: "Undo last action" })}
                onRedo={() => toast({ title: "Redo", description: "Redo last action" })}
                canUndo={false} // Mock
                canRedo={false} // Mock
            />

            {/* 3-Panel Workspace */}
            <div className="flex-1 border-x border-b rounded-b-lg overflow-hidden bg-white relative">
                {!selectedClassId && !loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 z-10">
                        <div className="text-center text-muted-foreground">
                            <p>Select a Class to manage curriculum</p>
                            <Button variant="link" onClick={handleAddClass}>Or create a new one</Button>
                        </div>
                    </div>
                ) : null}

                <ResizablePanelGroup direction="horizontal">

                    {/* LEFT: Tree View */}
                    <ResizablePanel defaultSize={20} className="bg-slate-50/50">
                        <div className="h-full flex flex-col">
                            <div className="p-3 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate flex justify-between items-center bg-slate-100/50">
                                <span>Hierarchy</span>
                                {selectedClassId && (
                                    <Button variant="ghost" size="icon" className="h-4 w-4 hover:bg-white" onClick={() => handleAddChild('subject')}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex-1 overflow-auto">
                                <CurriculumTree
                                    data={treeData}
                                    selectedId={selectedNode?.id}
                                    onSelect={setSelectedNode}
                                    onAction={handleTreeAction}
                                />
                            </div>
                        </div>
                    </ResizablePanel>

                    {/* Divider */}
                    <div className="w-px bg-slate-200" />

                    {/* CENTER: Entity Browser */}
                    <ResizablePanel defaultSize={50}>
                        <div className="h-full flex flex-col min-h-0 min-w-0">
                            <div className="p-3 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center gap-2 bg-white">
                                <span className="truncate">{selectedNode?.title || 'Subjects (Root)'}</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 whitespace-nowrap shrink-0">
                                    {selectedNode?.children?.length || (selectedNode ? 0 : treeData.length)} items
                                </span>
                            </div>
                            <EntityBrowser
                                parentNode={selectedNode || { id: 'root', title: 'Subjects', type: 'class', children: treeData }}
                                onSelect={setSelectedNode}
                                onAdd={(type) => handleAddChild(type, selectedNode || undefined)}
                                onAction={handleTreeAction}
                            />
                        </div>
                    </ResizablePanel>

                    {/* Divider */}
                    <div className="w-px bg-slate-200" />

                    {/* RIGHT: Details Panel */}
                    <ResizablePanel defaultSize={30} className="bg-slate-50/50">
                        <div className="h-full flex flex-col">
                            <div className="p-3 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Properties
                            </div>
                            <EntityDetails
                                node={selectedNode}
                                onAction={handleTreeAction}
                            />
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>

            <AddEntityDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onConfirm={handleCreateEntity}
                type={addDialogType}
                parentName={addDialogParent?.name}
            />
        </div>
    )
}
