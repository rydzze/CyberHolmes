"use client"
import { Star, StarOff, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSeverityColor, getSeverityIcon, formatDate } from "@/lib/utils/threat-utils"

interface ThreatDetailProps {
  threat: any
  onToggleFlag: (id: string) => void
}

export function ThreatDetail({ threat, onToggleFlag }: ThreatDetailProps) {
  if (!threat) return null

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{threat.title}</h1>
              <Badge variant="outline" className={`${getSeverityColor(threat.severity)}`}>
                {getSeverityIcon(threat.severity)}
                <span className="ml-1 capitalize">{threat.severity}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>ID: {threat.id}</span>
              <span>•</span>
              <span>Source: {threat.source}</span>
              <span>•</span>
              <span>Detected: {formatDate(threat.timestamp)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onToggleFlag(threat.id)}>
              {threat.isFlagged ? (
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
            <p className="text-muted-foreground">{threat.summary}</p>
          </div>

          {threat.details && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: threat.details }} />
            </div>
          )}

          {!threat.details && (
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
    </div>
  )
}
