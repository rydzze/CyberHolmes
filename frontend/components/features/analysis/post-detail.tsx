"use client"
import { ExternalLink, ChevronDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Post } from "@/lib/types/post"
import { formatDate, getConfidenceBadge } from "@/lib/utils/post"
import { useState } from "react"

interface PostDetailProps {
  post: Post
}

const getCVSSContainerColors = (rating: string | undefined | null) => {
  switch (rating?.toLowerCase()) {
    case "critical":
      return "border-red-300 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20"
    case "high":
      return "border-red-200 bg-red-50/80 dark:border-red-800/30 dark:bg-red-900/10"
    case "medium":
      return "border-orange-200 bg-orange-50 dark:border-amber-800/30 dark:bg-amber-900/10"
    case "low":
      return "border-yellow-200 bg-yellow-50 dark:border-yellow-800/30 dark:bg-yellow-900/10"
    default:
      return "border-gray-200 bg-gray-50 dark:border-gray-800/30 dark:bg-gray-900/10"
  }
}

const getCVSSTextColors = (rating: string | undefined | null) => {
  switch (rating?.toLowerCase()) {
    case "critical":
      return "text-red-900 dark:text-red-200"
    case "high":
      return "text-red-800 dark:text-red-300"
    case "medium":
      return "text-orange-900 dark:text-orange-200"
    case "low":
      return "text-yellow-900 dark:text-yellow-200"
    default:
      return "text-gray-900 dark:text-gray-200"
  }
}

export function PostDetail({ post }: PostDetailProps) {
  const [isMitreATTACKExpanded, setIsMitreATTACKExpanded] = useState(false)

  if (!post) return null

  let mitreAttackTechniques = []
  try {
    if (post.analysis?.mitre_attack_techniques) {
      mitreAttackTechniques = JSON.parse(post.analysis.mitre_attack_techniques)
    }
  } catch (error) {
    console.error("Error parsing MITRE techniques:", error)
  }

  const isThreat = post.analysis?.threat === true

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex-shrink-0 mt-1">
              {post.analysis && getConfidenceBadge(post.analysis.cvss_rating)}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span>ID: {post.id}</span>
            <span>•</span>
            <span>Source: {post.source}</span>
            <span>•</span>
            <span>Detected: {formatDate(post.timestamp)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Threat Prediction Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Threat Prediction</h2>
          {isThreat ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
              <p className="font-medium text-red-800 dark:text-red-400">Threat Detected</p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                This content has been identified as a potential security threat with a confidence score of{" "}
                {post.analysis?.confidence.toFixed(1)}%.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
              <p className="font-medium text-green-800 dark:text-green-400">No Threat Detected</p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                This content has been analyzed and no security threats were identified.
                {post.analysis?.confidence && ` Confidence: ${post.analysis.confidence.toFixed(1)}%`}
              </p>
            </div>
          )}
        </div>

        {/* CVSS Evaluation Section */}
        {isThreat && post.analysis?.cvss_vector && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Common Vulnerability Scoring System (CVSS) Evaluation</h2>
            <div className={`rounded-md border p-4 ${getCVSSContainerColors(post.analysis.cvss_rating)}`}>
              <p className={`${getCVSSTextColors(post.analysis.cvss_rating)}`}>
                This threat has a{" "}
                <span className="font-bold">{post.analysis.cvss_rating?.toLowerCase() || "neutral"}</span> severity rating with a
                CVSS base score of{" "}
                <span className="font-bold">{post.analysis.cvss_base_score?.toFixed(1) || "N/A"}</span>.
              </p>

              <div className={`mt-4 flex items-center space-x-4 ${getCVSSTextColors(post.analysis.cvss_rating)}`}>
                <p className={`text-sm font-bold`}> CVSS Vector String </p>
                <code className="block p-2 bg-black/5 dark:bg-white/5 rounded text-xs font-mono break-all">
                  {post.analysis.cvss_vector}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* MITRE ATT&CK Techniques Section */}
        {isThreat && mitreAttackTechniques.length > 0 && (
          <div className="mb-6">
            <div className="border-red-200 dark:border-red-900/50 rounded-md border overflow-hidden">
              <div
                className="p-4 border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 flex justify-between items-center cursor-pointer"
                onClick={() => setIsMitreATTACKExpanded(!isMitreATTACKExpanded)}
              >
                <h2 className="text-lg font-semibold text-red-800 dark:text-red-400">Possible MITRE ATT&CK Techniques</h2>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2 text-red-800 dark:text-red-400">
                  {isMitreATTACKExpanded ? "Collapse" : "Expand"}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMitreATTACKExpanded ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {isMitreATTACKExpanded && (
                <div className="border-t border-red-200 dark:border-red-900/50">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 border-b border-red-200 dark:border-red-900/50 grid grid-cols-4 font-medium text-sm text-red-800 dark:text-red-300">
                    <div>Technique ID</div>
                    <div className="col-span-2">Technique Name</div>
                    <div>Similarity</div>
                  </div>

                  <div className="overflow-y-auto bg-red-50 dark:bg-red-900/20">
                    {mitreAttackTechniques.map((technique, index) => (
                      <div
                        key={index}
                        className={`p-3 grid grid-cols-4 items-center ${index !== mitreAttackTechniques.length - 1 ? "border-b border-red-100 dark:border-red-900/30" : ""}`}
                      >
                        <div>
                          <Badge variant="outline" className="border-red-300 dark:border-red-700 text-red-800 dark:text-red-300">
                            {technique.id}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <a
                            href={`https://attack.mitre.org/techniques/${technique.id.replace(".", "/")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:underline flex items-center"
                          >
                            {technique.name}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                        <div className="text-red-800 dark:text-red-300">
                          {(technique.similarity_score * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sentiment Analysis and Source Info side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Analysis Section */}
          {post.analysis && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Sentiment Analysis</h2>
              <div className="rounded-md border p-4 bg-muted/20 min-h-[180px]">
                <div className="space-y-4">
                  {/* Overall sentiment and compound score in same row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Sentiment</p>
                      <p className="font-medium">{post.analysis.overall_sentiment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Compound Score</p>
                      <p className="font-medium">{post.analysis.compound_score.toFixed(4)}</p>
                    </div>
                  </div>

                  {/* Positive, negative, and neutral scores in same row */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Sentiment Scores</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Positive</p>
                        <p className="font-medium">{post.analysis.positive_score.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Negative</p>
                        <p className="font-medium">{post.analysis.negative_score.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Neutral</p>
                        <p className="font-medium">{post.analysis.neutral_score.toFixed(3)}</p>
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
                    <p>{post.source}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Original Link</p>
                    <a
                      href={post.link}
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
                    <p>{post.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User Profile</p>
                    <a
                      href={post.userlink}
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
            <p className="text-muted-foreground whitespace-pre-line">{post.content || "No content available"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

