import { AlertCircle, AlertTriangle, Shield, Skull } from "lucide-react"

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300"
  }
}

export const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <Skull className="h-4 w-4" />
    case "high":
      return <AlertCircle className="h-4 w-4" />
    case "medium":
      return <AlertTriangle className="h-4 w-4" />
    case "low":
      return <Shield className="h-4 w-4" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
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

