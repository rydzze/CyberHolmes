"use client"
import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Threat } from "@/lib/types/threat"
import { formatDate, getConfidenceBadge } from "@/lib/utils/threat"

interface ThreatListProps {
  threats: Threat[]
  selectedThreat: Threat | null
  onSelectThreat: (threat: Threat) => void
  searchTerm: string
  onSearchChange: (value: string) => void
  isLoading: boolean
}

export function ThreatList({
  threats,
  selectedThreat,
  onSelectThreat,
  searchTerm,
  onSearchChange,
  isLoading,
}: ThreatListProps) {
  const [confidenceFilter, setConfidenceFilter] = useState<string | null>(null)

  // Update the filteredThreats filter function to handle null content
  const filteredThreats = threats.filter((threat) => {
    // Apply confidence filter
    if (confidenceFilter) {
      const confidence = threat.analysis?.confidence || 0
      const confidenceDecimal = confidence > 1 ? confidence / 100 : confidence

      switch (confidenceFilter) {
        case "critical":
          return confidenceDecimal > 0.85
        case "high":
          return confidenceDecimal > 0.7 && confidenceDecimal <= 0.85
        case "medium":
          return confidenceDecimal > 0.6 && confidenceDecimal <= 0.7
        case "low":
          return confidenceDecimal > 0.5 && confidenceDecimal <= 0.6
        case "neutral":
          return confidenceDecimal <= 0.5
        default:
          return true
      }
    }
    return true
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search results..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex justify-between mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="mr-1 h-3 w-3" />
                {confidenceFilter
                  ? `Filter: ${confidenceFilter.charAt(0).toUpperCase() + confidenceFilter.slice(1)}`
                  : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setConfidenceFilter(null)}>All Results</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("critical")}>Critical</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("high")}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("low")}>Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfidenceFilter("neutral")}>Neutral</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="text-xs text-muted-foreground pt-2">{filteredThreats.length} results found</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
          </div>
        ) : filteredThreats.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <div>
              <p className="text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
            </div>
          </div>
        ) : (
          filteredThreats.map((threat) => (
            <div
              key={threat.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedThreat?.id === threat.id ? "bg-muted" : ""}`}
              onClick={() => onSelectThreat(threat)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm line-clamp-1">{threat.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {/* Enhanced capsule badge with better visibility */}
                <div className="flex-shrink-0">{threat.analysis && getConfidenceBadge(threat.analysis.confidence)}</div>
                <span className="text-xs text-muted-foreground ml-2">{formatDate(threat.timestamp)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {threat.content || "No content available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

