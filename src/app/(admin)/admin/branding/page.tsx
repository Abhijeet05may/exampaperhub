"use client"

import { useState } from "react"
import { Save, Upload, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropUpload } from "@/components/admin/upload/DragDropUpload"

export default function BrandingPage() {
    const [brandColor, setBrandColor] = useState("#0f172a")
    const [accentColor, setAccentColor] = useState("#3b82f6")

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Branding & Identity</h1>
                    <p className="text-muted-foreground">Customize how your exam papers and portal look.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" /> Preview PDF
                    </Button>
                    <Button>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="identity" className="w-full">
                <TabsList>
                    <TabsTrigger value="identity">Identity</TabsTrigger>
                    <TabsTrigger value="pdf">PDF Styles</TabsTrigger>
                </TabsList>

                <TabsContent value="identity" className="space-y-6 mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Institution Details</CardTitle>
                                <CardDescription>Basic information displayed on headers.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Institution Name</Label>
                                    <Input placeholder="e.g. Springfield High School" defaultValue="ExamPaperHub Demo Institute" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Est. Year</Label>
                                    <Input placeholder="e.g. 1995" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Website</Label>
                                    <Input placeholder="https://..." />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Visual Assets</CardTitle>
                                <CardDescription>Upload logos for darkness and light modes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Primary Logo</Label>
                                    <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                        <div className="text-center">
                                            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                                            <span className="text-xs text-muted-foreground">Click to upload logo</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Brand Colors</CardTitle>
                                <CardDescription>Primary colors used in headers and accents.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="grid gap-2 flex-1">
                                        <Label>Primary Color</Label>
                                        <div className="flex gap-2">
                                            <div
                                                className="w-10 h-10 rounded-md border shadow-sm"
                                                style={{ backgroundColor: brandColor }}
                                            />
                                            <Input
                                                value={brandColor}
                                                onChange={(e) => setBrandColor(e.target.value)}
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2 flex-1">
                                        <Label>Accent Color</Label>
                                        <div className="flex gap-2">
                                            <div
                                                className="w-10 h-10 rounded-md border shadow-sm"
                                                style={{ backgroundColor: accentColor }}
                                            />
                                            <Input
                                                value={accentColor}
                                                onChange={(e) => setAccentColor(e.target.value)}
                                                className="font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="pdf" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>PDF Header & Footer</CardTitle>
                            <CardDescription>Configure the layout of generated exam papers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Header Format</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Center Logo', 'Left Logo', 'Minimal'].map((layout) => (
                                        <div key={layout} className="border rounded-md p-4 text-center cursor-pointer hover:border-primary">
                                            <div className="h-12 bg-slate-100 mb-2 rounded"></div>
                                            <span className="text-xs font-medium">{layout}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-2">
                                <Label>Footer Text</Label>
                                <Input placeholder="e.g. Confidential - Internal Circulation Only" />
                            </div>

                            <div className="grid gap-2">
                                <Label>Watermark Text</Label>
                                <Input placeholder="e.g. DRAFT" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
