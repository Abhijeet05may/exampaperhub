"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground">Configure global preferences and security policies.</p>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="workflow">Workflow</TabsTrigger>
                    <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Information</CardTitle>
                            <CardDescription>Basic details about your installation.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Organization Name</Label>
                                <Input defaultValue="ExamPaperHub Inc." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Support Email</Label>
                                <Input defaultValue="support@exampaperhub.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Timezone</Label>
                                <Input defaultValue="Asia/Kolkata (GMT+5:30)" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Access Control</CardTitle>
                            <CardDescription>Manage password policies and login restrictions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Require 2FA</Label>
                                    <p className="text-sm text-muted-foreground">Force two-factor authentication for all admin accounts.</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Session Timeout</Label>
                                    <p className="text-sm text-muted-foreground">Automatically log out inactive users after 30 minutes.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <Label>Minimum Password Length</Label>
                                <Input type="number" defaultValue={8} className="max-w-[100px]" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Policies</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="workflow" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content Pipeline</CardTitle>
                            <CardDescription>Configure rules for content approval and processing.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto-Approve Uploads</Label>
                                    <p className="text-sm text-muted-foreground">Skip review queue for trusted uploaders.</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Strict Duplicate Check</Label>
                                    <p className="text-sm text-muted-foreground">Prevent uploading questions with >80% similarity.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="backup" className="space-y-4">
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-900">Danger Zone</CardTitle>
                            <CardDescription className="text-red-700">Irreversible actions. Proceed with caution.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50">
                                <div>
                                    <h4 className="font-medium text-red-900">Reset System Database</h4>
                                    <p className="text-sm text-red-700">Delete all content and users. Cannot be undone.</p>
                                </div>
                                <Button variant="destructive">
                                    <AlertTriangle className="mr-2 h-4 w-4" /> Reset Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
