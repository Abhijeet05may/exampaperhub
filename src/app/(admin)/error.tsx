'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
            <div className="p-4 bg-white rounded-md shadow border max-w-lg overflow-auto">
                <p className="font-mono text-sm text-slate-700">{error.message}</p>
                {error.digest && (
                    <p className="mt-2 text-xs text-slate-400">Digest: {error.digest}</p>
                )}
            </div>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    )
}
