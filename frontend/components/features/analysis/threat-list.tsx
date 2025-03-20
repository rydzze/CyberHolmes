"use client"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Threat } from "@/lib/types/threat"
import { formatDate, getConfidenceBadge } from "@/lib/utils/threat-utils"

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
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threats..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex justify-between mt-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Filter className="mr-1 h-3 w-3" />
            Filter
          </Button>
          <div className="text-xs text-muted-foreground pt-2">{threats.length} threats found</div>
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
        ) : threats.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <div>
              <p className="text-muted-foreground">No threats found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
            </div>
          </div>
        ) : (
          threats.map((threat) => (
            <div
              key={threat.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedThreat?.id === threat.id ? "bg-muted" : ""}`}
              onClick={() => onSelectThreat(threat)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm line-clamp-1">{threat.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-shrink-0">{getConfidenceBadge(threat.confidence)}</div>
                <span className="text-xs text-muted-foreground">{formatDate(threat.timestamp)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{threat.content}</p>
              <div className="mt-1 text-xs">
                <span className="text-muted-foreground">Source: </span>
                <span>{threat.username}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

