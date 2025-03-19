"use client"

import * as React from "react"
import { BugIcon as Spider, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface DeployFormProps {
  selectedCrawler: any
}

export function DeployForm({ selectedCrawler }: DeployFormProps) {
  const [isDeploying, setIsDeploying] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("basic")

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeploying(true)

    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false)
      // In a real app, this would navigate to the records page or show a success message
    }, 2000)
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Deploy Crawler</CardTitle>
        <CardDescription>
          {selectedCrawler
            ? `Configure and deploy ${selectedCrawler.name}`
            : "Select a crawler from the list or configure a new one"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {!selectedCrawler ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Spider className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Crawler Selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select a crawler from the list or create a new one to configure and deploy
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDeploy}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="crawler-name">Crawler Name</Label>
                  <Input id="crawler-name" defaultValue={selectedCrawler.name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crawler-type">Crawler Type</Label>
                  <Select defaultValue={selectedCrawler.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crawler type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Web Crawler</SelectItem>
                      <SelectItem value="darkweb">Dark Web Crawler</SelectItem>
                      <SelectItem value="forum">Forum Crawler</SelectItem>
                      <SelectItem value="social">Social Media Crawler</SelectItem>
                      <SelectItem value="custom">Custom Crawler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-urls">Target URLs</Label>
                  <Textarea
                    id="target-urls"
                    placeholder="Enter URLs (one per line)"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="depth">Crawl Depth</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Surface only</SelectItem>
                        <SelectItem value="2">2 - Medium depth</SelectItem>
                        <SelectItem value="3">3 - Deep crawl</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-urls">Max URLs</Label>
                    <Input id="max-urls" type="number" defaultValue="500" required />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="user-agent">User Agent</Label>
                  <Input
                    id="user-agent"
                    defaultValue="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request-delay">Request Delay (ms)</Label>
                  <Input id="request-delay" type="number" defaultValue="200" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (ms)</Label>
                  <Input id="timeout" type="number" defaultValue="30000" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Crawler Behavior</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="respect-robots" className="cursor-pointer">
                        Respect robots.txt
                      </Label>
                      <Switch id="respect-robots" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="follow-redirects" className="cursor-pointer">
                        Follow redirects
                      </Label>
                      <Switch id="follow-redirects" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="capture-screenshots" className="cursor-pointer">
                        Capture screenshots
                      </Label>
                      <Switch id="capture-screenshots" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="javascript-rendering" className="cursor-pointer">
                        JavaScript rendering
                      </Label>
                      <Switch id="javascript-rendering" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select defaultValue="once">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="time" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Notifications</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notification" className="cursor-pointer">
                        Email notification on completion
                      </Label>
                      <Switch id="email-notification" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-on-failure" className="cursor-pointer">
                        Alert on failure
                      </Label>
                      <Switch id="alert-on-failure" defaultChecked />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" type="button">
                Save Template
              </Button>
              <Button type="submit" disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Spider className="mr-2 h-4 w-4" />
                    Deploy Crawler
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

