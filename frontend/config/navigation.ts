import { BarChart3, BugIcon as Spider, FileSearch } from "lucide-react"

export const navigationItems = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", icon: BarChart3, href: "/" },
      { name: "Crawler", icon: Spider, href: "/crawler" },
      { name: "Analysis", icon: FileSearch, href: "/analysis" },
    ],
  },
]
