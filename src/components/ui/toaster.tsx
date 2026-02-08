
'use client'

import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    <div key={id} className="grid gap-1 rounded-lg border bg-white p-4 text-slate-950 shadow-lg">
                        {title && <div className="text-sm font-semibold">{title}</div>}
                        {description && <div className="text-sm opacity-90">{description}</div>}
                        {action}
                    </div>
                )
            })}
        </div>
    )
}
