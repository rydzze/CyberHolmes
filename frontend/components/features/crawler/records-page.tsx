"use client"

import * as React from "react"
import {
  Search,
  Filter,
  Download,
  Eye,
  RotateCw,
  Trash2,
  BugIcon as Spider,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample crawler records data
const crawlerRecords = [
  {
    id: "r-001",
    crawlerName: "DarkWeb-Scanner-01",
    crawlerType: "darkweb",
    startTime: "2023-06-15T14:32:00Z",
    endTime: "2023-06-15T16:45:00Z",
    status: "completed",
    urlsScanned: 487,
    urlsTotal: 500,
    threatsDetected: 23,
    user: "john.doe@example.com",
  },
  {
    id: "r-002",
    crawlerName: "Social-Media-Monitor-02",
    crawlerType: "social",
    startTime: "2023-06-14T09:17:00Z",
    endTime: "2023-06-14T11:30:00Z",
    status: "completed",
    urlsScanned: 245,
    urlsTotal: 250,
    threatsDetected: 8,
    user: "john.doe@example.com",
  },
  {
    id: "r-003",
    crawlerName: "Forum-Crawler-03",
    crawlerType: "forum",
    startTime: "2023-06-13T22:45:00Z",
    endTime: null,
    status: "running",
    urlsScanned: 127,
    urlsTotal: 280,
    threatsDetected: 5,
    user: "jane.smith@example.com",
  },
  {
    id: "r-004",
    crawlerName: "Standard-Web-Scanner-04",
    crawlerType: "standard",
    startTime: "2023-06-12T16:30:00Z",
    endTime: "2023-06-12T17:15:00Z",
    status: "failed",
    urlsScanned: 78,
    urlsTotal: 300,
    threatsDetected: 2,
    user: "john.doe@example.com",
    error: "Connection timeout after 30 seconds",
  },
  {
    id: "r-005",
    crawlerName: "Weekly-Threat-Scan",
    crawlerType: "standard",
    startTime: "2023-06-11T11:20:00Z",
    endTime: "2023-06-11T14:45:00Z",
    status: "completed",
    urlsScanned: 500,
    urlsTotal: 500,
    threatsDetected: 17,
    user: "jane.smith@example.com",
  },
  {
    id: "r-006",
    crawlerName: "DarkWeb-Scanner-02",
    crawlerType: "darkweb",
    startTime: "2023-06-10T08:15:00Z",
    endTime: "2023-06-10T10:30:00Z",
    status: "completed",
    urlsScanned: 320,
    urlsTotal: 320,
    threatsDetected: 15,
    user: "john.doe@example.com",
  },
  {
    id: "r-007",
    crawlerName: "Social-Media-Scan",
    crawlerType: "social",
    startTime: "2023-06-09T14:50:00Z",
    endTime: "2023-06-09T15:20:00Z",
    status: "failed",
    urlsScanned: 45,
    urlsTotal: 200,
    threatsDetected: 0,
    user: "jane.smith@example.com",
    error: "API rate limit exceeded",
  },
  {
    id: "r-008",
    crawlerName: "Custom-Threat-Scanner",
    crawlerType: "custom",
    startTime: "2023-06-08T19:22:00Z",
    endTime: "2023-06-08T21:15:00Z",
    status: "completed",
    urlsScanned: 150,
    urlsTotal: 150,
    threatsDetected: 12,
    user: "john.doe@example.com",
  },
  {
    id: "r-009",
    crawlerName: "Weekly-Threat-Scan",
    crawlerType: "standard",
    startTime: "2023-06-04T11:20:00Z",
    endTime: "2023-06-04T14:30:00Z",
    status: "completed",
    urlsScanned: 500,
    urlsTotal: 500,
    threatsDetected: 21,
    user: "jane.smith@example.com",
  },
  {
    id: "r-010",
    crawlerName: "DarkWeb-Scanner-01",
    crawlerType: "darkweb",
    startTime: "2023-06-01T14:32:00Z",
    endTime: "2023-06-01T16:45:00Z",
    status: "completed",
    urlsScanned: 487,
    urlsTotal: 500,
    threatsDetected: 19,
    user: "john.doe@example.com",
  },
  {
    id: "r-011",
    crawlerName: "Forum-Crawler-Special",
    crawlerType: "forum",
    startTime: "2023-05-28T10:15:00Z",
    endTime: "2023-05-28T12:30:00Z",
    status: "completed",
    urlsScanned: 200,
    urlsTotal: 200,
    threatsDetected: 7,
    user: "john.doe@example.com",
  },
  {
    id: "r-012",
    crawlerName: "Darknet-Monitor-Advanced",
    crawlerType: "darkweb",
    startTime: "2023-05-25T08:20:00Z",
    endTime: "2023-05-25T11:45:00Z",
    status: "completed",
    urlsScanned: 350,
    urlsTotal: 350,
    threatsDetected: 28,
    user: "jane.smith@example.com",
  },
  {
    id: "r-013",
    crawlerName: "Social-Media-Extended",
    crawlerType: "social",
    startTime: "2023-05-22T14:10:00Z",
    endTime: "2023-05-22T16:20:00Z",
    status: "completed",
    urlsScanned: 180,
    urlsTotal: 180,
    threatsDetected: 4,
    user: "john.doe@example.com",
  },
  {
    id: "r-014",
    crawlerName: "Standard-Web-Scanner-Full",
    crawlerType: "standard",
    startTime: "2023-05-18T09:30:00Z",
    endTime: "2023-05-18T13:15:00Z",
    status: "completed",
    urlsScanned: 600,
    urlsTotal: 600,
    threatsDetected: 15,
    user: "jane.smith@example.com",
  },
  {
    id: "r-015",
    crawlerName: "Custom-Threat-Deep",
    crawlerType: "custom",
    startTime: "2023-05-15T11:45:00Z",
    endTime: "2023-05-15T14:30:00Z",
    status: "failed",
    urlsScanned: 120,
    urlsTotal: 300,
    threatsDetected: 3,
    user: "john.doe@example.com",
    error: "API authentication failed",
  },
  {
    id: "r-016",
    crawlerName: "Weekly-Threat-Scan",
    crawlerType: "standard",
    startTime: "2023-05-11T11:20:00Z",
    endTime: "2023-05-11T14:45:00Z",
    status: "completed",
    urlsScanned: 500,
    urlsTotal: 500,
    threatsDetected: 19,
    user: "jane.smith@example.com",
  },
  {
    id: "r-017",
    crawlerName: "DarkWeb-Scanner-Extended",
    crawlerType: "darkweb",
    startTime: "2023-05-08T16:20:00Z",
    endTime: "2023-05-08T19:10:00Z",
    status: "completed",
    urlsScanned: 420,
    urlsTotal: 420,
    threatsDetected: 31,
    user: "john.doe@example.com",
  },
  {
    id: "r-018",
    crawlerName: "Forum-Crawler-Targeted",
    crawlerType: "forum",
    startTime: "2023-05-05T13:40:00Z",
    endTime: "2023-05-05T15:15:00Z",
    status: "completed",
    urlsScanned: 150,
    urlsTotal: 150,
    threatsDetected: 9,
    user: "jane.smith@example.com",
  },
  {
    id: "r-019",
    crawlerName: "Social-Media-Focused",
    crawlerType: "social",
    startTime: "2023-05-02T10:30:00Z",
    endTime: "2023-05-02T12:45:00Z",
    status: "completed",
    urlsScanned: 220,
    urlsTotal: 220,
    threatsDetected: 6,
    user: "john.doe@example.com",
  },
  {
    id: "r-020",
    crawlerName: "Standard-Web-Scanner-Light",
    crawlerType: "standard",
    startTime: "2023-04-28T09:15:00Z",
    endTime: "2023-04-28T10:30:00Z",
    status: "completed",
    urlsScanned: 250,
    urlsTotal: 250,
    threatsDetected: 8,
    user: "jane.smith@example.com",
  },
  {
    id: "r-021",
    crawlerName: "Weekly-Threat-Scan",
    crawlerType: "standard",
    startTime: "2023-04-25T11:20:00Z",
    endTime: "2023-04-25T14:30:00Z",
    status: "completed",
    urlsScanned: 500,
    urlsTotal: 500,
    threatsDetected: 22,
    user: "john.doe@example.com",
  },
  {
    id: "r-022",
    crawlerName: "Custom-Threat-Scanner-Special",
    crawlerType: "custom",
    startTime: "2023-04-22T15:10:00Z",
    endTime: "2023-04-22T17:45:00Z",
    status: "completed",
    urlsScanned: 180,
    urlsTotal: 180,
    threatsDetected: 11,
    user: "jane.smith@example.com",
  },
  {
    id: "r-023",
    crawlerName: "DarkWeb-Scanner-Focused",
    crawlerType: "darkweb",
    startTime: "2023-04-18T12:30:00Z",
    endTime: "2023-04-18T15:15:00Z",
    status: "completed",
    urlsScanned: 300,
    urlsTotal: 300,
    threatsDetected: 25,
    user: "john.doe@example.com",
  },
  {
    id: "r-024",
    crawlerName: "Social-Media-Limited",
    crawlerType: "social",
    startTime: "2023-04-15T09:45:00Z",
    endTime: "2023-04-15T11:20:00Z",
    status: "failed",
    urlsScanned: 85,
    urlsTotal: 150,
    threatsDetected: 2,
    user: "jane.smith@example.com",
    error: "Rate limit exceeded",
  },
  {
    id: "r-025",
    crawlerName: "Forum-Crawler-Quick",
    crawlerType: "forum",
    startTime: "2023-04-12T14:20:00Z",
    endTime: "2023-04-12T15:30:00Z",
    status: "completed",
    urlsScanned: 100,
    urlsTotal: 100,
    threatsDetected: 5,
    user: "john.doe@example.com",
  },
]

export function RecordsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [selectedRecord, setSelectedRecord] = React.useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const recordsPerPage = 10

  // Filter records based on search term and filters
  const filteredRecords = crawlerRecords.filter((record) => {
    const matchesSearch =
      record.crawlerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.crawlerType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Calculate pagination values
  const totalRecords = filteredRecords.length
  const totalPages = Math.ceil(totalRecords / recordsPerPage)

  // Get current page records
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord)

  // Pagination controls
  const goToPage = (page) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    setCurrentPage(page)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "running":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            <Spider className="mr-1 h-3 w-3" />
            Running
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
            <Clock className="mr-1 h-3 w-3" />
            Scheduled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    }
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Crawler Records</CardTitle>
              <CardDescription>View and manage your crawler execution history</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-1 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("all")
                      setTypeFilter("all")
                    }}
                  >
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1) // Reset to first page on filter change
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value)
                  setCurrentPage(1) // Reset to first page on filter change
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="darkweb">Dark Web</SelectItem>
                  <SelectItem value="forum">Forum</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crawler</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Threats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.crawlerName}</TableCell>
                      <TableCell>{record.crawlerType.charAt(0).toUpperCase() + record.crawlerType.slice(1)}</TableCell>
                      <TableCell>{formatDate(record.startTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        {record.status === "running" ? (
                          <div className="flex items-center">
                            <span className="mr-2">{Math.round((record.urlsScanned / record.urlsTotal) * 100)}%</span>
                            <div className="h-2 w-24 rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(record.urlsScanned / record.urlsTotal) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span>
                            {record.urlsScanned}/{record.urlsTotal}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{record.threatsDetected}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(record)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                          {record.status === "failed" && (
                            <Button variant="ghost" size="icon">
                              <RotateCw className="h-4 w-4" />
                              <span className="sr-only">Retry</span>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
                <span className="font-medium">
                  {indexOfLastRecord > totalRecords ? totalRecords : indexOfLastRecord}
                </span>{" "}
                of <span className="font-medium">{totalRecords}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate page numbers to show (centered around current page)
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => goToPage(pageNum)}
                        className="h-8 w-8"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crawler Record Details</DialogTitle>
            <DialogDescription>
              {selectedRecord && `Details for ${selectedRecord.crawlerName} execution`}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Crawler Name</h4>
                  <p>{selectedRecord.crawlerName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                  <p>{selectedRecord.crawlerType.charAt(0).toUpperCase() + selectedRecord.crawlerType.slice(1)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">User</h4>
                  <p>{selectedRecord.user}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Start Time</h4>
                  <p>{formatDate(selectedRecord.startTime)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">End Time</h4>
                  <p>{formatDate(selectedRecord.endTime)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">URLs Scanned</h4>
                  <p>
                    {selectedRecord.urlsScanned} / {selectedRecord.urlsTotal}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Threats Detected</h4>
                  <p>{selectedRecord.threatsDetected}</p>
                </div>
              </div>

              {selectedRecord.error && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Error</h4>
                    <p className="text-red-500">{selectedRecord.error}</p>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                {selectedRecord.status === "failed" && (
                  <Button>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Retry Crawler
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

