"use client"

import * as React from "react"
import {
  Search,
  Filter,
  AlertCircle,
  AlertTriangle,
  Shield,
  Skull,
  Star,
  StarOff,
  Flag,
  Download,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample threat data
const threatData = [
  {
    id: "T-1001",
    title: "Suspicious Phishing Campaign Targeting Financial Institutions",
    source: "DarkWeb-Scanner-01",
    timestamp: "2023-06-15T14:32:00Z",
    severity: "critical",
    status: "active",
    summary:
      "A sophisticated phishing campaign targeting multiple financial institutions has been detected. The attackers are using spoofed emails that appear to come from legitimate banking services.",
    details: "",
    isFlagged: true,
  },
  {
    id: "T-1002",
    title: "New Ransomware Variant Targeting Healthcare Sector",
    source: "Forum-Crawler-03",
    timestamp: "2023-06-14T09:17:00Z",
    severity: "high",
    status: "active",
    summary:
      "A new ransomware variant named 'MediLock' has been identified specifically targeting healthcare organizations. Initial analysis suggests it exploits vulnerabilities in outdated medical record systems.",
    details: "",
    isFlagged: true,
  },
  {
    id: "T-1003",
    title: "Credential Stuffing Attack Against E-commerce Platforms",
    source: "DarkWeb-Scanner-01",
    timestamp: "2023-06-13T22:45:00Z",
    severity: "medium",
    status: "active",
    summary:
      "Large-scale credential stuffing attacks have been observed against multiple e-commerce platforms. Attackers are using previously leaked credentials to gain unauthorized access to user accounts.",
    details: "",
    isFlagged: false,
  },
  {
    id: "T-1004",
    title: "Zero-day Vulnerability in Popular CMS Platform",
    source: "Forum-Crawler-03",
    timestamp: "2023-06-12T16:30:00Z",
    severity: "critical",
    status: "active",
    summary:
      "A zero-day vulnerability has been discovered in a widely used Content Management System. The vulnerability allows for remote code execution without authentication.",
    details: "",
    isFlagged: true,
  },
  {
    id: "T-1005",
    title: "DDoS Attack Infrastructure Being Assembled",
    source: "DarkWeb-Scanner-02",
    timestamp: "2023-06-11T11:20:00Z",
    severity: "high",
    status: "monitoring",
    summary:
      "Intelligence suggests a large botnet is being assembled for potential DDoS attacks. Command and control servers have been identified in multiple countries.",
    details: "",
    isFlagged: false,
  },
  {
    id: "T-1006",
    title: "Data Breach at Third-party Payment Processor",
    source: "Social-Media-Scan",
    timestamp: "2023-06-10T08:15:00Z",
    severity: "high",
    status: "confirmed",
    summary:
      "A major data breach has been confirmed at a third-party payment processor affecting multiple online retailers. Exposed data includes payment card information and personal details.",
    details: "",
    isFlagged: true,
  },
  {
    id: "T-1007",
    title: "Supply Chain Attack Targeting Software Developers",
    source: "Weekly-Threat-Scan",
    timestamp: "2023-06-09T14:50:00Z",
    severity: "medium",
    status: "investigating",
    summary:
      "A potential supply chain attack targeting software development tools has been identified. The attack involves compromised packages in popular package repositories.",
    details: "",
    isFlagged: false,
  },
  {
    id: "T-1008",
    title: "Insider Threat: Credentials for Sale on Dark Web",
    source: "DarkWeb-Scanner-01",
    timestamp: "2023-06-08T19:22:00Z",
    severity: "high",
    status: "active",
    summary:
      "Administrative credentials for several corporate networks have been found for sale on dark web marketplaces. Evidence suggests an insider threat may be involved.",
    details: "",
    isFlagged: true,
  },
]

export function AnalysisPage() {
  const [selectedThreat, setSelectedThreat] = React.useState(threatData[0])
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredThreats = threatData.filter(
    (threat) =>
      threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return <Skull className="h-4 w-4" />
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "low":
        return <Shield className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const toggleFlag = (id) => {
    const updatedThreats = threatData.map((threat) => {
      if (threat.id === id) {
        return { ...threat, isFlagged: !threat.isFlagged }
      }
      return threat
    })

    // Update the selected threat if it's the one being flagged/unflagged
    if (selectedThreat.id === id) {
      setSelectedThreat({ ...selectedThreat, isFlagged: !selectedThreat.isFlagged })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left sidebar - Threat list */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search threats..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="mr-1 h-3 w-3" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  Sort: Newest
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Newest</DropdownMenuItem>
                <DropdownMenuItem>Oldest</DropdownMenuItem>
                <DropdownMenuItem>Severity (High-Low)</DropdownMenuItem>
                <DropdownMenuItem>Severity (Low-High)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredThreats.map((threat) => (
            <div
              key={threat.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedThreat.id === threat.id ? "bg-muted" : ""}`}
              onClick={() => setSelectedThreat(threat)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm line-clamp-1">{threat.title}</h3>
                {threat.isFlagged && <Flag className="h-3 w-3 text-red-500 shrink-0 mt-1" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getSeverityColor(threat.severity)}`}>
                  {getSeverityIcon(threat.severity)}
                  <span className="ml-1 capitalize">{threat.severity}</span>
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(threat.timestamp)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{threat.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content - Threat details */}
      <div className="flex-1 overflow-auto">
        {selectedThreat && (
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{selectedThreat.title}</h1>
                  <Badge variant="outline" className={`${getSeverityColor(selectedThreat.severity)}`}>
                    {getSeverityIcon(selectedThreat.severity)}
                    <span className="ml-1 capitalize">{selectedThreat.severity}</span>
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span>ID: {selectedThreat.id}</span>
                  <span>•</span>
                  <span>Source: {selectedThreat.source}</span>
                  <span>•</span>
                  <span>Detected: {formatDate(selectedThreat.timestamp)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => toggleFlag(selectedThreat.id)}>
                  {selectedThreat.isFlagged ? (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Star className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Summary</h2>
                <p className="text-muted-foreground">{selectedThreat.summary}</p>
              </div>

              {selectedThreat.details && (
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedThreat.details }} />
                </div>
              )}

              {!selectedThreat.details && (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="font-medium text-muted-foreground">Detailed analysis not available</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select "Generate Analysis" to create a detailed report
                  </p>
                  <Button className="mt-4">Generate Analysis</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

