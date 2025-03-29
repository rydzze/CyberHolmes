"use client"
import { ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { Threat } from "@/lib/types/threat"
import { formatDate, getConfidenceBadge } from "@/lib/utils/threat"

interface ThreatDetailProps {
  threat: Threat
}

export function ThreatDetail({ threat }: ThreatDetailProps) {
  if (!threat) return null

  // Get the confidence level for display in the analysis section
  const confidenceDecimal = threat.analysis?.confidence ? threat.analysis.confidence / 100 : 0
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
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{threat.title}</h1>
            {/* Display confidence badge based on analysis data */}
            <div className="flex-shrink-0 mt-1">
              {threat.analysis && getConfidenceBadge(threat.analysis.confidence)}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span>ID: {threat.id}</span>
            <span>•</span>
            <span>Source: {threat.source}</span>
            <span>•</span>
            <span>Detected: {formatDate(threat.timestamp)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Threat Prediction Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Threat Prediction</h2>
          {threat.analysis?.threat === "Yes" ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
              <p className="font-medium text-red-800 dark:text-red-400">{confidenceLevel} Threat Detected</p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                This content has been identified as a potential security threat with a confidence score of{" "}
                {threat.analysis.confidence.toFixed(1)}%.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
              <p className="font-medium text-green-800 dark:text-green-400">No Threat Detected</p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                This content has been analyzed and no security threats were identified.
                {threat.analysis?.confidence && ` Confidence: ${threat.analysis.confidence.toFixed(1)}%`}
              </p>
            </div>
          )}
        </div>

        {/* Sentiment Analysis and Source Info side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Analysis Section */}
          {threat.analysis && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Sentiment Analysis</h2>
              <div className="rounded-md border p-4 bg-muted/20 min-h-[180px]">
                <div className="space-y-4">
                  {/* Overall sentiment and compound score in same row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Sentiment</p>
                      <p className="font-medium">{threat.analysis.overall_sentiment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Compound Score</p>
                      <p className="font-medium">{threat.analysis.compound_score.toFixed(4)}</p>
                    </div>
                  </div>

                  {/* Positive, negative, and neutral scores in same row */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Sentiment Scores</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Positive</p>
                        <p className="font-medium">{threat.analysis.positive_score.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Negative</p>
                        <p className="font-medium">{threat.analysis.negative_score.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Neutral</p>
                        <p className="font-medium">{threat.analysis.neutral_score.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Source Information */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Source Information</h2>
            <div className="rounded-md border p-4 bg-muted/20 min-h-[180px]">
              <div className="grid grid-cols-2 gap-4">
                {/* Left column: Source and Original Link */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Source</p>
                    <p>{threat.source}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Original Link</p>
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
                </div>

                {/* Right column: Username and User Profile */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p>{threat.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User Profile</p>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Original Content */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Original Content</h2>
          <div className="rounded-md border p-4 bg-muted/20">
            <p className="text-muted-foreground whitespace-pre-line">{threat.content || "No content available"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

