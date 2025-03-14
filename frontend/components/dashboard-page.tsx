"use client"
import {
  BarChart,
  LineChart,
  PieChart,
  DonutChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/chart"
import { ArrowUpRight, ArrowDownRight, Globe, Shield, AlertTriangle, Skull } from "lucide-react"

export function DashboardPage() {
  // Sample data for charts
  const threatsByRegion = [
    { name: "North America", value: 35 },
    { name: "Europe", value: 25 },
    { name: "Asia", value: 20 },
    { name: "South America", value: 10 },
    { name: "Africa", value: 7 },
    { name: "Australia", value: 3 },
  ]

  const threatTrendData = [
    { name: "Jan", Malware: 40, Phishing: 24, DDoS: 10 },
    { name: "Feb", Malware: 30, Phishing: 28, DDoS: 15 },
    { name: "Mar", Malware: 45, Phishing: 26, DDoS: 12 },
    { name: "Apr", Malware: 50, Phishing: 32, DDoS: 8 },
    { name: "May", Malware: 65, Phishing: 30, DDoS: 20 },
    { name: "Jun", Malware: 60, Phishing: 35, DDoS: 25 },
  ]

  const threatTypeData = [
    { name: "Malware", value: 40 },
    { name: "Phishing", value: 30 },
    { name: "DDoS", value: 15 },
    { name: "Ransomware", value: 10 },
    { name: "Other", value: 5 },
  ]

  const severityData = [
    { name: "Critical", value: 15 },
    { name: "High", value: 25 },
    { name: "Medium", value: 35 },
    { name: "Low", value: 25 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +18% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigated</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">906</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +7% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Threats</CardTitle>
            <Skull className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                -2% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Threat Trends</CardTitle>
            <CardDescription>Monthly threat activity by type</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={threatTrendData}
              index="name"
              categories={["Malware", "Phishing", "DDoS"]}
              colors={["#2563eb", "#f97316", "#ef4444"]}
              yAxisWidth={40}
              height={300}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Threat Types</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={threatTypeData}
              index="name"
              valueFormatter={(number) => `${number}%`}
              category="value"
              colors={["#2563eb", "#f97316", "#ef4444", "#8b5cf6", "#a3a3a3"]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Threats by Region</CardTitle>
            <CardDescription>Geographic distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={threatsByRegion}
              index="name"
              categories={["value"]}
              colors={["#2563eb"]}
              valueFormatter={(number) => `${number}%`}
              yAxisWidth={48}
              height={300}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Threat Severity</CardTitle>
            <CardDescription>Distribution by impact level</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <DonutChart
              data={severityData}
              index="name"
              category="value"
              valueFormatter={(number) => `${number}%`}
              colors={["#ef4444", "#f97316", "#eab308", "#22c55e"]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
