"use client"

import * as React from "react"
import { BugIcon as Spider, Play, Pause, RotateCw, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function CrawlerPage() {
  const [isDeploying, setIsDeploying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const handleDeploy = () => {
    setIsDeploying(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDeploying(false)
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deploy Crawler</CardTitle>
            <CardDescription>Configure and deploy web crawlers to gather threat intelligence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="crawler-name" className="text-sm font-medium">
                Crawler Name
              </label>
              <Input id="crawler-name" placeholder="e.g., DarkWeb-Scanner-01" />
            </div>

            <div className="space-y-2">
              <label htmlFor="crawler-type" className="text-sm font-medium">
                Crawler Type
              </label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue placeholder="Select crawler type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Web Crawler</SelectItem>
                  <SelectItem value="darkweb">Dark Web Crawler</SelectItem>
                  <SelectItem value="forum">Forum Crawler</SelectItem>
                  <SelectItem value="social">Social Media Crawler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="target-urls" className="text-sm font-medium">
                Target URLs
              </label>
              <Textarea id="target-urls" placeholder="Enter URLs (one per line)" className="min-h-[100px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="depth" className="text-sm font-medium">
                  Crawl Depth
                </label>
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
                <label htmlFor="frequency" className="text-sm font-medium">
                  Frequency
                </label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save Template</Button>
            <Button onClick={handleDeploy} disabled={isDeploying}>
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
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Crawlers</CardTitle>
            <CardDescription>Monitor and manage your deployed crawlers</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4 pt-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Spider className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">DarkWeb-Scanner-01</h4>
                        <p className="text-xs text-muted-foreground">Started 2 hours ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Running
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress: 68%</span>
                      <span>URLs: 342/500</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </Button>
                  </div>
                </div>

                {isDeploying && (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Spider className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">New Crawler</h4>
                          <p className="text-xs text-muted-foreground">Started just now</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Initializing
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress: {progress}%</span>
                        <span>Initializing...</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                )}

                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Spider className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Forum-Crawler-03</h4>
                        <p className="text-xs text-muted-foreground">Started 5 hours ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Paused
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress: 45%</span>
                      <span>URLs: 127/280</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Play className="mr-1 h-3 w-3" />
                      Resume
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scheduled" className="pt-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Spider className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Weekly-Threat-Scan</h4>
                        <p className="text-xs text-muted-foreground">Scheduled for tomorrow, 03:00 UTC</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Scheduled
                    </Badge>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Cancel
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="pt-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">DarkWeb-Scanner-02</h4>
                        <p className="text-xs text-muted-foreground">Completed 2 days ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Completed
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>500 URLs scanned • 127 threats detected</p>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCw className="mr-1 h-3 w-3" />
                      Run Again
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <h4 className="font-medium">Social-Media-Scan</h4>
                        <p className="text-xs text-muted-foreground">Failed 3 days ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Failed
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Error: API rate limit exceeded</p>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCw className="mr-1 h-3 w-3" />
                      Retry
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
