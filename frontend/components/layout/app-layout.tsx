"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ThemeToggle } from "@/components/common/theme-toggle"

interface AppLayoutProps {
  children: React.ReactNode
  title: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/cookies here
    router.push("/")
  }

  return (
    <SidebarProvider>
      <AppSidebar handleLogout={handleLogout} />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between gap-4 border-b px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className={title === "Analysis" ? "flex-1" : "flex-1 p-6"}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

