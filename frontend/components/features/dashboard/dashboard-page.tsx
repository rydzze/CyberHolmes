"use client"
import { LineChart } from "./line_chart"
import { BarChart1, BarChart2 } from "./bar_chart"
import { PieChart1, PieChart2 } from "./pie_chart"
import { SummaryStats } from "./summary_stats"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <LineChart />
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 md:grid-rows-3">
            <SummaryStats />
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 row-span-2 col-span-3">
              <BarChart1 />
              <BarChart2 />
            </div>
          </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
          <PieChart1 />
          <PieChart2 />
      </div>
    </div>
  )
}
