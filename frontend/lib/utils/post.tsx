import { AlertCircle, AlertTriangle, Shield, Skull } from "lucide-react"

export const getConfidenceBadge = (cvssRating: string | null | undefined) => {
  let bgColor = ""
  let textColor = ""
  let borderColor = ""
  let icon = null
  let label = ""

  switch (cvssRating?.toLowerCase()) {
    case "critical":
      bgColor = "bg-red-100 dark:bg-red-900/30"
      textColor = "text-red-800 dark:text-red-300"
      borderColor = "border-red-300 dark:border-red-800"
      icon = <Skull className="h-4 w-4 text-red-700 dark:text-red-400" />
      label = "Critical"
      break
    case "high":
      bgColor = "bg-red-50 dark:bg-red-900/20"
      textColor = "text-red-800 dark:text-red-300"
      borderColor = "border-red-200 dark:border-red-800/50"
      icon = <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      label = "High"
      break
    case "medium":
      bgColor = "bg-orange-100 dark:bg-amber-900/40"
      textColor = "text-orange-800 dark:text-amber-200"
      borderColor = "border-orange-300 dark:border-amber-700"
      icon = <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-amber-300" />
      label = "Medium"
      break
    case "low":
      bgColor = "bg-yellow-100 dark:bg-yellow-900/40"
      textColor = "text-yellow-800 dark:text-yellow-200"
      borderColor = "border-yellow-300 dark:border-yellow-700"
      icon = <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
      label = "Low"
      break
    default:
      bgColor = "bg-green-50 dark:bg-green-900/20"
      textColor = "text-green-700 dark:text-green-300"
      borderColor = "border-green-200 dark:border-green-800/50"
      icon = <Shield className="h-4 w-4 text-green-500 dark:text-green-400" />
      label = "Neutral"
      break
  }

  // Enhanced capsule shape with better color visibility and subtle glow
  return (
    <div
      className={`
      inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
      ${bgColor} ${textColor} ${borderColor} border
      shadow-sm hover:shadow-md transition-shadow
    `}
    >
      <div className="flex items-center">
        <span className="mr-1">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>
    </div>
  )
}

// Separate function for displaying confidence percentage
export const getConfidencePercentage = (confidence: number) => {
  const confidenceDecimal = confidence > 1 ? confidence / 100 : confidence
  return `${(confidenceDecimal * 100).toFixed(1)}%`
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

