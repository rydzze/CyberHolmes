import { AlertCircle, AlertTriangle, Shield, Skull } from "lucide-react"

export const getConfidenceBadge = (confidence: number) => {
  const confidenceDecimal = confidence > 1 ? confidence / 100 : confidence

  let bgColor = ""
  let textColor = ""
  let borderColor = ""
  let icon = null
  let label = ""

  if (confidenceDecimal > 0.85) {
    bgColor = "bg-red-100"
    textColor = "text-red-900"
    borderColor = "border-red-300"
    icon = <Skull className="h-4 w-4 text-red-700" />
    label = "Critical"
  } else if (confidenceDecimal > 0.7) {
    bgColor = "bg-red-50"
    textColor = "text-red-800"
    borderColor = "border-red-200"
    icon = <AlertCircle className="h-4 w-4 text-red-600" />
    label = "High"
  } else if (confidenceDecimal > 0.6) {
    bgColor = "bg-orange-50"
    textColor = "text-orange-700"
    borderColor = "border-orange-200"
    icon = <AlertTriangle className="h-4 w-4 text-orange-500" />
    label = "Medium"
  } else if (confidenceDecimal > 0.5) {
    bgColor = "bg-yellow-50"
    textColor = "text-yellow-700"
    borderColor = "border-yellow-200"
    icon = <AlertTriangle className="h-4 w-4 text-yellow-500" />
    label = "Low"
  } else {
    bgColor = "bg-green-50"
    textColor = "text-green-700"
    borderColor = "border-green-200"
    icon = <Shield className="h-4 w-4 text-green-500" />
    label = "Neutral"
  }

  return (
    <div
      className={`
      inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
      ${bgColor} ${textColor} ${borderColor} border
      shadow-sm
    `}
    >
      <div className="flex items-center">
        <span className="mr-1">{icon}</span>
        <span>{label}</span>
      </div>
    </div>
  )
}

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

