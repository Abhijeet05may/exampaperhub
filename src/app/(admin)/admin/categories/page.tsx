"use client"

import CurriculumWorkspace from "@/components/admin/curriculum/CurriculumWorkspace"

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Curriculum Manager</h1>
                    <p className="text-muted-foreground">Manage your academic hierarchy from Class level to Topics.</p>
                </div>
            </div>

            <CurriculumWorkspace />
        </div>
    )
}
