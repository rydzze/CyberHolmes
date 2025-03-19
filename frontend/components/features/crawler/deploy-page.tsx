"use client"

import * as React from "react"
import { CrawlerList } from "@/components/features/crawler/crawler-list"
import { DeployForm } from "@/components/features/crawler/deploy-form"

export function DeployPage() {
  const [selectedCrawler, setSelectedCrawler] = React.useState(null)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CrawlerList onSelectCrawler={setSelectedCrawler} selectedCrawler={selectedCrawler} />
      <DeployForm selectedCrawler={selectedCrawler} />
    </div>
  )
}

