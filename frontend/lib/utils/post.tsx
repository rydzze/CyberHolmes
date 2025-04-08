import { AlertCircle, AlertTriangle, Shield, Skull } from "lucide-react"

export const getConfidenceBadge = (confidence: number) => {
  // Convert confidence from percentage (0-100) to decimal (0-1) if needed
  const confidenceDecimal = confidence > 1 ? confidence / 100 : confidence

  let bgColor = ""
  let textColor = ""
  let borderColor = ""
  let icon = null
  let label = ""

  // Confidence level ranges with enhanced colors for better visibility
  if (confidenceDecimal > 0.85) {
    // Critical Threat: 0.85 < x <= 1 (dark red)
    bgColor = "bg-red-100 dark:bg-red-900/30"
    textColor = "text-red-800 dark:text-red-300"
    borderColor = "border-red-300 dark:border-red-800"
    icon = <Skull className="h-4 w-4 text-red-700 dark:text-red-400" />
    label = "Critical"
  } else if (confidenceDecimal > 0.7) {
    // High Threat: 0.7 < x <= 0.85 (lighter red)
    bgColor = "bg-red-50 dark:bg-red-900/20"
    textColor = "text-red-800 dark:text-red-300"
    borderColor = "border-red-200 dark:border-red-800/50"
    icon = <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
    label = "High"
  } else if (confidenceDecimal > 0.6) {
    // Medium Threat: 0.6 < x <= 0.7 (vibrant orange)
    bgColor = "bg-orange-50 dark:bg-orange-900/20"
    textColor = "text-orange-700 dark:text-orange-300"
    borderColor = "border-orange-200 dark:border-orange-800/50"
    icon = <AlertTriangle className="h-4 w-4 text-orange-500 dark:text-orange-400" />
    label = "Medium"
  } else if (confidenceDecimal > 0.5) {
    // Low Threat: 0.5 < x <= 0.6 (vibrant yellow)
    bgColor = "bg-yellow-50 dark:bg-yellow-900/20"
    textColor = "text-yellow-700 dark:text-yellow-300"
    borderColor = "border-yellow-200 dark:border-yellow-800/50"
    icon = <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
    label = "Low"
  } else {
    // Neutral: 0 <= x <= 0.5 (green)
    bgColor = "bg-green-50 dark:bg-green-900/20"
    textColor = "text-green-700 dark:text-green-300"
    borderColor = "border-green-200 dark:border-green-800/50"
    icon = <Shield className="h-4 w-4 text-green-500 dark:text-green-400" />
    label = "Neutral"
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

