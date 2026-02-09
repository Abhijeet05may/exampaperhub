"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Library,
    FileText,
    Upload,
    Users,
    Settings,
    Image,
    BookOpen,
    BarChart,
    ChevronLeft,
    ChevronRight,
    LifeBuoy,
    LogOut,
    Shield,
    Layers,
    FileStack,
    History,
    PlusCircle,
    ListTodo,
    GraduationCap
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- Types ---

interface SidebarItemType {
    title: string
    href?: string
    icon: React.ElementType
    badge?: string
    variant?: "default" | "ghost"
    disabled?: boolean
}

interface SidebarGroupType {
    title: string
    items: SidebarItemType[]
}

// --- Configuration ---

const sidebarGroups: SidebarGroupType[] = [
    {
        title: "Main",
        items: [
            { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        ]
    },
    {
        title: "Content Management",
        items: [
            { title: "Upload Center", href: "/admin/upload", icon: Upload },
            { title: "Processing Queue", href: "/admin/queue", icon: Layers, badge: "Beta" },
            { title: "Question Bank", href: "/admin/questions", icon: Library },
            { title: "Add Manual", href: "/admin/questions/new", icon: PlusCircle },
            { title: "Review Queue", href: "/admin/reviews", icon: ListTodo, badge: "12" },
        ]
    },
    {
        title: "Curriculum",
        items: [
            { title: "Curriculum Structure", href: "/admin/categories", icon: BookOpen },
        ]
    },
    {
        title: "Paper System",
        items: [
            { title: "Templates", href: "/admin/templates", icon: FileText },
            { title: "Marking Rules", href: "/admin/rules", icon: Shield },
            { title: "Branding", href: "/admin/branding", icon: Image },
        ]
    },
    {
        title: "Users & Access",
        items: [
            { title: "Admins & Staff", href: "/admin/users", icon: Users },
            { title: "Roles", href: "/admin/permissions", icon: Shield },
        ]
    },
    {
        title: "Analytics",
        items: [
            { title: "Reports", href: "/admin/analytics", icon: BarChart },
        ]
    }
]

// --- Components ---

export function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    // Mock user for now - replacing real auth for UI demo
    const user = {
        name: "Admin User",
        email: "admin@exampaperhub.com",
        role: "Super Admin",
        avatar: "/avatars/01.png"
    }

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "relative flex flex-col h-screen border-r bg-slate-50/50 transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-[80px]" : "w-[280px]"
                )}
            >
                {/* 1. Header & Branding */}
                <div className={cn("flex items-center h-16 px-4 border-b bg-white", isCollapsed ? "justify-center" : "justify-between")}>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="font-bold text-lg leading-none tracking-tight">ExamHub</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Waitlist v1.0</span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto text-muted-foreground" onClick={toggleCollapse}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Collapsed Toggle Button (Floating when collapsed) */}
                {isCollapsed && (
                    <div className="absolute -right-3 top-20 z-10">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full shadow-md bg-white border-muted"
                            onClick={toggleCollapse}
                        >
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                {/* 2. Scrollable Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <div className="px-3 space-y-6">
                        {sidebarGroups.map((group, groupIndex) => (
                            <div key={group.title} className="space-y-1">
                                {!isCollapsed ? (
                                    <h4 className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
                                        {group.title}
                                    </h4>
                                ) : (
                                    <div className="h-px bg-border/50 mx-2 my-2" />
                                )}

                                {group.items.map((item, itemIndex) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                                    if (isCollapsed) {
                                        return (
                                            <Tooltip key={item.href}>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={item.href || '#'}
                                                        className={cn(
                                                            "flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground mx-auto",
                                                            isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground"
                                                        )}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                        <span className="sr-only">{item.title}</span>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="flex items-center gap-2">
                                                    {item.title}
                                                    {item.badge && (
                                                        <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{item.badge}</span>
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href || '#'}
                                            className={cn(
                                                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                                isActive ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-600 border border-transparent"
                                            )}
                                        >
                                            <item.icon className={cn("h-4 w-4", isActive ? "text-primary placeholder:fill-primary" : "text-slate-400 group-hover:text-slate-600")} />
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* 3. Footer System Section */}
                <div className="p-3 mt-auto bg-slate-50 border-t space-y-2">
                    {!isCollapsed && (
                        <div className="px-2 pb-2">
                            <h4 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
                                System
                            </h4>
                        </div>
                    )}

                    <Link
                        href="/admin/settings"
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-accent hover:text-accent-foreground",
                            isCollapsed && "justify-center px-0"
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>
                    <Link
                        href="/help"
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-accent hover:text-accent-foreground",
                            isCollapsed && "justify-center px-0"
                        )}
                    >
                        <LifeBuoy className="h-4 w-4" />
                        {!isCollapsed && <span>Help & Support</span>}
                    </Link>

                    <Separator className="my-2" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn("w-full justify-start px-2 py-6 hover:bg-white hover:shadow-sm", isCollapsed && "justify-center px-0")}>
                                <div className="flex items-center gap-3 w-full">
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                                    </Avatar>
                                    {!isCollapsed && (
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.role}</span>
                                        </div>
                                    )}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Preferences</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </TooltipProvider>
    )
}
