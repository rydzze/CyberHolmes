"use client"

import * as React from "react"
import { Moon, Sun, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PreferencesModal() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleOpenModal = () => setOpen(true)
    window.addEventListener("open-preferences-modal", handleOpenModal)
    return () => window.removeEventListener("open-preferences-modal", handleOpenModal)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>Customize your application settings</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <div className="text-sm text-muted-foreground">Choose your preferred theme</div>
              </div>
              <Select
                defaultValue="system"
                onValueChange={(value) => {
                  document.documentElement.classList.remove("light", "dark")
                  if (value !== "system") {
                    document.documentElement.classList.add(value)
                  } else {
                    // Check system preference
                    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "dark"
                      : "light"
                    document.documentElement.classList.add(systemPreference)
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sidebar Behavior</Label>
                <div className="text-sm text-muted-foreground">Control how the sidebar behaves</div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sidebar-collapse" defaultChecked />
                <Label htmlFor="sidebar-collapse">Auto-collapse on mobile</Label>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Animations</Label>
                <div className="text-sm text-muted-foreground">Enable or disable UI animations</div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="animations" defaultChecked />
                <Label htmlFor="animations">Enable animations</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <div className="text-sm text-muted-foreground">Receive email alerts for critical threats</div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" defaultChecked />
                <Label htmlFor="email-notifications">Enabled</Label>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <div className="text-sm text-muted-foreground">Receive browser notifications</div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="push-notifications" defaultChecked />
                <Label htmlFor="push-notifications">Enabled</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Notification Severity Threshold</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Only receive notifications for threats at or above this severity
              </div>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical only</SelectItem>
                  <SelectItem value="high">High and above</SelectItem>
                  <SelectItem value="medium">Medium and above</SelectItem>
                  <SelectItem value="low">All severities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>API Access</Label>
                <div className="text-sm text-muted-foreground">Enable API access for integrations</div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="api-access" defaultChecked />
                <Label htmlFor="api-access">Enabled</Label>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Retention</Label>
                <div className="text-sm text-muted-foreground">How long to keep threat intelligence data</div>
              </div>
              <Select defaultValue="90">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Format</Label>
                <div className="text-sm text-muted-foreground">Default format for exporting data</div>
              </div>
              <Select defaultValue="json">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="stix">STIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
