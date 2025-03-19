"use client"
import { Settings, User, Sliders, LogOut, Shield, ChevronDown, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Navigation items moved to a separate config file
import { navigationItems } from "@/config/navigation"

export function AppSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }))
  }

  // Check if a path is active or one of its children is active
  const isActiveOrHasActiveChild = (item) => {
    if (pathname === item.href) return true
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href)
    }
    return false
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b">
        <div className="flex items-center p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <span className="ml-2 text-lg font-semibold">CyberHolmes</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    {item.subItems ? (
                      <>
                        <SidebarMenuButton
                          isActive={isActiveOrHasActiveChild(item)}
                          onClick={() => toggleExpand(item.name)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>
                          {expandedItems[item.name] ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                        {expandedItems[item.name] && (
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.name}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                  <a href={subItem.href} className="flex items-center">
                                    <subItem.icon className="mr-2 h-4 w-4" />
                                    <span>{subItem.name}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <a href={item.href} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center p-2 cursor-pointer hover:bg-muted/50 rounded-md">
              <div className="h-8 w-8 rounded-full bg-muted">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Analyst</p>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent("open-profile-modal"))}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent("open-preferences-modal"))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#" onClick={() => window.dispatchEvent(new CustomEvent("toggle-theme"))}>
                <Sliders className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/logout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

