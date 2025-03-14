"use client"
import { Search, Filter, Flag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getSeverityColor, getSeverityIcon, formatDate } from "@/lib/utils/threat-utils"

interface ThreatListProps {
  threats: any[]
  selectedThreat: any
  onSelectThreat: (threat: any) => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function ThreatList({ threats, selectedThreat, onSelectThreat, searchTerm, onSearchChange }: ThreatListProps) {
  return (
    <div className="w-80 border-r flex flex-col">
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
        {threats.map((threat) => (
          <div
            key={threat.id}
            className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedThreat.id === threat.id ? "bg-muted" : ""}`}
            onClick={() => onSelectThreat(threat)}
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
  )
}
