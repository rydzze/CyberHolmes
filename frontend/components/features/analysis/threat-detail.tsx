"use client"
import { Star, StarOff, Download, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Threat } from "@/lib/types/threat"
import { formatDate, getConfidenceBadge, getConfidencePercentage } from "@/lib/utils/threat-utils"

interface ThreatDetailProps {
  threat: Threat
  onToggleFlag: (id: number) => void
}

export function ThreatDetail({ threat, onToggleFlag }: ThreatDetailProps) {
  if (!threat) return null

  // Get the confidence level for display in the analysis section
  const confidenceDecimal = threat.confidence > 1 ? threat.confidence / 100 : threat.confidence
  const confidenceLevel =
    confidenceDecimal > 0.85
      ? "Critical"
      : confidenceDecimal > 0.7
        ? "High"
        : confidenceDecimal > 0.6
          ? "Medium"
          : confidenceDecimal > 0.5
            ? "Low"
            : "Neutral"

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{threat.title}</h1>
              {/* CHANGE: Enhanced capsule badge with better visibility */}
              <div className="flex-shrink-0 mt-1">{getConfidenceBadge(threat.confidence)}</div>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>ID: {threat.id}</span>
              <span>•</span>
              <span>Source: Spider #{threat.spider}</span>
              <span>•</span>
              <span>Detected: {formatDate(threat.timestamp)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Analysis Section - Moved to the top */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Analysis</h2>
          {threat.threat === "Yes" ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
              <p className="font-medium text-red-800 dark:text-red-400">{confidenceLevel} Threat Detected</p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                This content has been identified as a potential security threat with a confidence score of{" "}
                {getConfidencePercentage(threat.confidence)}.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
              <p className="font-medium text-green-800 dark:text-green-400">No Threat Detected</p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                This content has been analyzed and no security threats were identified.
              </p>
            </div>
          )}
        </div>

        {/* Source Information - Now second */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Source Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p>{threat.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Original Link</p>
              <a
                href={threat.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                Visit Source
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User Profile</p>
              <a
                href={threat.userlink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                View Profile
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <p>{getConfidencePercentage(threat.confidence)}</p>
            </div>
          </div>
        </div>

        {/* Content - Now last */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Original Content</h2>
          <div className="rounded-md border p-4 bg-muted/20">
            <p className="text-muted-foreground whitespace-pre-line">{threat.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

