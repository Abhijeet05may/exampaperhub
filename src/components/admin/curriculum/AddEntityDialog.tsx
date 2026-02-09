"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { NodeType } from "./types"

interface AddEntityDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (name: string) => void
    type: NodeType
    parentName?: string
}

export function AddEntityDialog({
    isOpen,
    onClose,
    onConfirm,
    type,
    parentName
}: AddEntityDialogProps) {
    const [name, setName] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onConfirm(name)
            setName("")
            onClose()
        }
    }

    const getTitle = () => {
        switch (type) {
            case 'class': return 'Add New Class'
            case 'subject': return `Add Subject to ${parentName}`
            case 'book': return `Add Book to ${parentName}`
            case 'chapter': return `Add Chapter to ${parentName}`
            case 'topic': return `Add Topic to ${parentName}`
            default: return 'Add Item'
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{getTitle()}</DialogTitle>
                        <DialogDescription>
                            Enter the name for the new {type}. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                autoFocus
                                placeholder={`e.g. ${type === 'class' ? 'Class 11' : type === 'subject' ? 'Physics' : 'New ' + type}`}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
