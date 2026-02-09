import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface PreviewDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    item: any // Replace with proper type
}

export function PreviewDrawer({ open, onOpenChange, item }: PreviewDrawerProps) {
    if (!item) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full bg-slate-50">
                <SheetHeader className="pb-4 border-b">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                            {item.type}
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 shadow-none capitalize">
                            {item.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <SheetTitle className="text-lg leading-snug">
                        Preview Content
                    </SheetTitle>
                    <SheetDescription className="font-mono text-xs">
                        ID: {item.id}
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 -mx-6 px-6 py-4">
                    <div className="space-y-6">
                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <Label className="text-muted-foreground text-xs">Category</Label>
                                <p className="font-medium">{item.category}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs">Difficulty</Label>
                                <p className="font-medium capitalize">{item.difficulty || 'N/A'}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs">Updated</Label>
                                <p>{new Date(item.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Content Preview */}
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Question</Label>
                            <div className="p-4 bg-white rounded-lg border shadow-sm prose prose-sm max-w-none">
                                {/* Render HTML safely here in real app */}
                                {item.title}
                            </div>
                        </div>

                        {/* Options (Mock) */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Options</Label>
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map((opt) => (
                                    <div key={opt} className="flex items-center gap-3 p-3 bg-white rounded-md border text-sm">
                                        <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500">
                                            {String.fromCharCode(64 + opt)}
                                        </div>
                                        <span>Sample Option {opt}</span>
                                        {opt === 2 && <CheckCircle className="ml-auto h-4 w-4 text-emerald-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <SheetFooter className="pt-4 border-t flex gap-2 sm:justify-between">
                    <div className="flex gap-2 w-full">
                        <Link href={`/admin/questions/${item.id}`} className="w-full">
                            <Button variant="outline" className="w-full">
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </Link>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button variant="ghost" className="w-10 px-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                            <XCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
