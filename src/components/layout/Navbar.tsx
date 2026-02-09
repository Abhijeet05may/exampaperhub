'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { BookOpen, Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link className="flex items-center gap-2 font-bold text-xl mr-6" href="/">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span>ExamPaperHub</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/browse">
                        Browse Questions
                    </Link>
                    <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/features">
                        Features
                    </Link>
                    <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/pricing">
                        Pricing
                    </Link>
                </nav>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="/browse" className="text-lg font-medium">
                                    Browse Questions
                                </Link>
                                <Link href="/features" className="text-lg font-medium">
                                    Features
                                </Link>
                                <Link href="/pricing" className="text-lg font-medium">
                                    Pricing
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full justify-start">Log In</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="w-full justify-start">Get Started</Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
