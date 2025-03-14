"use client"

import * as React from "react"
import { BugIcon as Spider, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CrawlerFormProps {
  onDeploy: () => void
}

export function CrawlerForm({ onDeploy }: CrawlerFormProps) {
  const [isDeploying, setIsDeploying] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeploying(true)
    onDeploy()

    // Reset deploying state after a delay
    setTimeout(() => {
      setIsDeploying(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy Crawler</CardTitle>
        <CardDescription>Configure and deploy web crawlers to gather threat intelligence</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="crawler-name" className="text-sm font-medium">
              Crawler Name
            </label>
            <Input id="crawler-name" placeholder="e.g., DarkWeb-Scanner-01" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="crawler-type" className="text-sm font-medium">
              Crawler Type
            </label>
            <Select defaultValue="standard" required>
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
            <Textarea id="target-urls" placeholder="Enter URLs (one per line)" className="min-h-[100px]" required />
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
        </CardFooter>
      </form>
    </Card>
  )
}
