"use client"

import * as React from "react"
import { Search, Plus, Edit, Trash2, Copy, BugIcon as Spider } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample crawler data
const crawlerTemplates = [
  {
    id: "c-001",
    name: "DarkWeb-Scanner",
    type: "darkweb",
    description: "Scans dark web forums and marketplaces for threats",
    lastUsed: "2023-06-15T14:32:00Z",
    targets: 120,
    isTemplate: true,
  },
  {
    id: "c-002",
    name: "Social-Media-Monitor",
    type: "social",
    description: "Monitors social media platforms for security threats",
    lastUsed: "2023-06-10T09:17:00Z",
    targets: 45,
    isTemplate: true,
  },
  {
    id: "c-003",
    name: "Forum-Crawler",
    type: "forum",
    description: "Crawls security forums for vulnerability discussions",
    lastUsed: "2023-06-05T22:45:00Z",
    targets: 78,
    isTemplate: true,
  },
  {
    id: "c-004",
    name: "Standard-Web-Scanner",
    type: "standard",
    description: "General purpose web crawler for threat intelligence",
    lastUsed: "2023-06-01T16:30:00Z",
    targets: 200,
    isTemplate: true,
  },
  {
    id: "c-005",
    name: "Custom-Threat-Scanner",
    type: "custom",
    description: "Custom crawler for specific threat intelligence needs",
    lastUsed: "2023-05-28T11:20:00Z",
    targets: 35,
    isTemplate: false,
  },
]

interface CrawlerListProps {
  onSelectCrawler: (crawler: any) => void
  selectedCrawler: any
}

export function CrawlerList({ onSelectCrawler, selectedCrawler }: CrawlerListProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [newCrawlerName, setNewCrawlerName] = React.useState("")
  const [newCrawlerType, setNewCrawlerType] = React.useState("standard")

  const filteredCrawlers = crawlerTemplates.filter(
    (crawler) =>
      crawler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crawler.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleCreateCrawler = () => {
    // In a real app, this would create a new crawler
    setIsCreateDialogOpen(false)
    setNewCrawlerName("")
    setNewCrawlerType("standard")
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Crawlers</CardTitle>
            <CardDescription>Select a crawler to deploy or create a new one</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </CardHeader>
      <div className="px-6 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search crawlers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-3">
          {filteredCrawlers.map((crawler) => (
            <div
              key={crawler.id}
              className={`rounded-lg border p-3 cursor-pointer hover:bg-muted/50 ${
                selectedCrawler?.id === crawler.id ? "bg-muted" : ""
              }`}
              onClick={() => onSelectCrawler(crawler)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Spider className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">{crawler.name}</h4>
                    <p className="text-xs text-muted-foreground">Last used: {formatDate(crawler.lastUsed)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {crawler.isTemplate && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      Template
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Open menu</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-sm mt-1">{crawler.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <span>Type: {crawler.type.charAt(0).toUpperCase() + crawler.type.slice(1)}</span>
                <span className="mx-2">•</span>
                <span>Target URLs: {crawler.targets}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Crawler</DialogTitle>
            <DialogDescription>Create a new crawler template for your threat intelligence needs.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="crawler-name" className="text-right">
                Name
              </Label>
              <Input
                id="crawler-name"
                value={newCrawlerName}
                onChange={(e) => setNewCrawlerName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Custom-Threat-Scanner"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="crawler-type" className="text-right">
                Type
              </Label>
              <Select value={newCrawlerType} onValueChange={setNewCrawlerType}>
                <SelectTrigger className="col-span-3">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCrawler}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

