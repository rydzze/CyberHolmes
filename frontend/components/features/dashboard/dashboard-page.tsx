"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PostScrapedOverTime } from "./area-chart"
import { SummaryStats } from "./summary-stats"
import { PostScrapedBySource, ThreatPostsBySource } from "./vert-bar-chart"
import { TopKeywordsChartClearWeb, TopKeywordsChartDarkWeb,
         TopEntitiesChartClearWeb, TopEntitiesChartDarkWeb } from "./horiz-bar-chart"
import { SeverityDistributionChartClearWeb, SeverityDistributionChartDarkWeb } from "./pie-chart"
import { Globe, Skull } from "lucide-react"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <PostScrapedOverTime />
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 md:grid-rows-3">
            <SummaryStats />
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 row-span-2 col-span-3">
              <PostScrapedBySource />
              <ThreatPostsBySource />
            </div>
          </div>
      </div>

      <div className="grid gap-4 md:grid-rows-2">
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardContent>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <Card className="bg-blue-50 dark:bg-blue-950 overflow-hidden flex flex-col items-center justify-center p-6">
                  <div className="flex flex-col items-center justify-center space-y-8 text-center">
                    <div>
                      <CardTitle className="text-center">Clear Web</CardTitle>
                      <CardDescription className="text-center mt-1">Surface internet intelligence</CardDescription>
                    </div>
                    <div className="rounded-full bg-blue-100 p-6 dark:bg-blue-900 mt-8">
                      <Globe
                        className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-pulse"
                        style={{ animationDuration: "3s" }}
                      />
                    </div>
                  </div>
                </Card>
                <TopKeywordsChartClearWeb />
                <TopEntitiesChartClearWeb />
                <SeverityDistributionChartClearWeb />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardContent>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <Card className="bg-red-50 dark:bg-red-950 overflow-hidden flex flex-col items-center justify-center p-6">
                  <div className="flex flex-col items-center justify-center space-y-8 text-center">
                    <div>
                      <CardTitle className="text-center">Dark Web</CardTitle>
                      <CardDescription className="text-center mt-1">Hidden network intelligence</CardDescription>
                    </div>
                    <div className="rounded-full bg-red-100 p-6 dark:bg-red-900 mt-8">
                      <Skull
                        className="h-16 w-16 text-red-600 dark:text-red-400 animate-pulse"
                        style={{ animationDuration: "3s" }}
                      />
                    </div>
                  </div>
                </Card>
                <TopKeywordsChartDarkWeb />
                <TopEntitiesChartDarkWeb />
                <SeverityDistributionChartDarkWeb />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
