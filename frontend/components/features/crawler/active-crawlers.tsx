"use client"
import { BugIcon as Spider, Play, Pause, RotateCw, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ActiveCrawlersProps {
  isDeploying: boolean
  progress: number
}

export function ActiveCrawlers({ isDeploying, progress }: ActiveCrawlersProps) {
  return (
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
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
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
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
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
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                >
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
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
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
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
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
                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
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
  )
}
