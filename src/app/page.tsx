import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/layout/Navbar"
import { BookOpen, FileText, CheckCircle, ArrowRight, Zap, Shield, Layout } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/90 to-background"></div>

                    <div className="container px-4 md:px-6 relative">
                        <div className="flex flex-col items-center space-y-8 text-center">
                            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium rounded-full">
                                Example Paper Hub v1.0 is here! 🚀
                            </Badge>
                            <div className="space-y-4 max-w-3xl">
                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                    Create Professional <span className="text-primary">Exam Papers</span> in Minutes
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl leading-relaxed">
                                    A powerful tool for teachers to generate, customize, and download exam papers with ease.
                                    Streamline your workflow with our advanced question bank and automated formatting.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link href="/signup">
                                    <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/browse">
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                                        Explore Question Bank
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary/30">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                                Everything you need to manage exams
                            </h2>
                            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                                Powerful features designed to save time and improve quality.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <Card className="bg-background/60 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Extensive Question Bank</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Access thousands of questions across various subjects. Organize by class, chapter, and topic hierarchy.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Smart PDF Generation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Generate professionally formatted question papers and answer keys in a single click. No more formatting headaches.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        <Layout className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">DOCX Import</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Bulk upload questions directly from Word documents. Our smart parser handles images, formulas, and formatting.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Instant Paper Builder</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Select questions to a "bucket" and reorder them with drag-and-drop ease. Build the perfect paper in minutes.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Role-Based Access</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Secure separate portals for Admins (Teachers) and Students. Practice mode for students and management for teachers.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-muted transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        <CheckCircle className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">Auto-Answer Keys</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Every paper comes with an automatically generated answer key with detailed explanations.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-24 md:py-32 bg-primary text-primary-foreground">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Ready to transform your exam process?
                            </h2>
                            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                                Join hundreds of teachers and institutions simplifying their assessment workflow.
                            </p>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link href="/signup">
                                    <Button size="lg" variant="secondary" className="h-12 px-8 text-lg rounded-full">
                                        Get Started for Free
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                        Contact Sales
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
                <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2024 ExamPaperHub. All rights reserved.
                    </p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
                            Terms of Service
                        </Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
                            Privacy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}
