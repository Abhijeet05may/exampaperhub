'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, FileText, Settings, LogOut, Search } from "lucide-react"

export function StudentSidebar() {
    const pathname = usePathname()

    const links = [
        { href: "/student", label: "Dashboard", icon: LayoutDashboard },
        { href: "/browse", label: "Browse Questions", icon: Search },
        { href: "/paper", label: "My Paper Bucket", icon: FileText },
        { href: "/student/settings", label: "Settings", icon: Settings },
    ]

    return (
        <div className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-screen sticky top-0">
            <div className="p-6">
                <h2 className="text-lg font-bold tracking-tight text-primary">
                    Student Portal
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Prepare for excellence</p>
            </div>

            <div className="flex-1 px-4 space-y-2">
                {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Button
                            variant={pathname === link.href ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start transition-all duration-200",
                                pathname === link.href
                                    ? "bg-primary/10 text-primary shadow-sm hover:bg-primary/20"
                                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <link.icon className={cn("mr-3 h-4 w-4", pathname === link.href ? "text-primary" : "text-muted-foreground")} />
                            {link.label}
                        </Button>
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t bg-muted/20">
                <Link href="/logout">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                    </Button>
                </Link>
            </div>
        </div>
    )
}
