import { BarChart3, BugIcon as Spider, FileSearch, Rocket, History } from "lucide-react"

export const navigationItems = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
      {
        name: "Crawler",
        icon: Spider,
        subItems: [
          { name: "Deploy", icon: Rocket, href: "/crawler/deploy" },
          { name: "Records", icon: History, href: "/crawler/records" },
        ],
      },
      { name: "Analysis", icon: FileSearch, href: "/analysis" },
    ],
  },
]

