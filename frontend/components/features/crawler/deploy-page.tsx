"use client"

import * as React from "react"
import { BugIcon as Spider, RotateCw, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { deployCrawler } from "@/lib/api/crawler"

// Define source options
const SOURCES = [
  {
    id: "Reddit",
    name: "Clear Web - Reddit",
    description: "Crawls Reddit posts published within the last month.",
    type: "clear_web",
  },
  {
    id: "DarkNet Army",
    name: "Dark Web - DarkNet Army",
    description: "Crawls DarkNet Army forum posts published within the last month/year.",
    type: "dark_web",
  },
  {
    id: "Best Carding World",
    name: "Dark Web - Best Carding World",
    description: "Crawls Best Carding World forum posts published within the last month/year.",
    type: "dark_web",
  },
]

export function DeployPage() {
  const [source, setSource] = React.useState("")
  const [keyword, setKeyword] = React.useState("")
  const [isDeploying, setIsDeploying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  // Get the selected source details
  const selectedSource = SOURCES.find((p) => p.id === source)

  // Handle form submission
  const handleDeploy = async () => {
    try {
      setIsDeploying(true)
      setError(null)
      setSuccess(null)

      // Validate form
      if (!source) {
        throw new Error("Please select a source")
      }
      if (!keyword.trim()) {
        throw new Error("Please enter a keyword")
      }

      // Use the API function to deploy crawler
      await deployCrawler({
        source: selectedSource?.id || "",
        keyword: keyword.trim(),
      })

      // Show success message
      setSuccess(`Successfully deployed ${selectedSource?.name} crawler with keyword "${keyword}"`)

      // Reset form
      setSource("")
      setKeyword("")
    } catch (err) {
      console.error("Error deploying crawler:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left side - Form */}
      <Card>
        <CardHeader>
          <CardTitle>Deploy Crawler</CardTitle>
          <CardDescription>Configure and deploy a web crawler to gather threat intelligence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Select source to crawl" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyword">Keyword</Label>
            <Input
              id="keyword"
              placeholder="Enter search keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {selectedSource && (
            <div className="rounded-md bg-muted p-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Crawler Information</h4>
              <p className="text-sm text-muted-foreground">{selectedSource.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right side - Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Crawler Summary</CardTitle>
          <CardDescription>Review and deploy your configured crawler</CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedSource ? (
            <div className="flex h-[200px] items-center justify-center text-center">
              <div className="max-w-md space-y-2">
                <Spider className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No Source Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a source and enter a keyword to configure your crawler
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Selected Source</h3>
                  <div className="flex items-center mt-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Spider className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{selectedSource.name}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Search Keyword</h3>
                  <div className="mt-2 rounded-md border p-3">
                    {keyword ? (
                      <p className="font-medium">{keyword}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No keyword entered</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Crawler Behavior</h3>
                  <p className="mt-2 text-sm">{selectedSource.description}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleDeploy} disabled={!source || !keyword.trim() || isDeploying}>
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
    </div>
  )
}

