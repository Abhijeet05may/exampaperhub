export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-muted/40">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/5 via-transparent to-transparent"></div>

            <div className="z-10 w-full max-w-lg px-4">
                {children}
            </div>
        </div>
    )
}
