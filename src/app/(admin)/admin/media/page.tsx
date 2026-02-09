import MediaGallery from '@/components/admin/media/MediaGallery'

export default function AdminMediaPage() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Manage images and files used in questions and papers.
                    </p>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <MediaGallery />
            </div>
        </div>
    )
}
