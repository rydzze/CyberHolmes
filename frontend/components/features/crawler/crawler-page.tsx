"use client"

import * as React from "react"
import { CrawlerForm } from "@/components/features/crawler/crawler-form"
import { ActiveCrawlers } from "@/components/features/crawler/active-crawlers"

export function CrawlerPage() {
  const [isDeploying, setIsDeploying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const handleDeploy = () => {
    setIsDeploying(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDeploying(false)
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CrawlerForm onDeploy={handleDeploy} />
        <ActiveCrawlers isDeploying={isDeploying} progress={progress} />
      </div>
    </div>
  )
}
