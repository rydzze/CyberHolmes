"use client"

import * as React from "react"
import { ThreatList } from "@/components/features/analysis/threat-list"
import { ThreatDetail } from "@/components/features/analysis/threat-detail"
import type { Threat } from "@/lib/types/threat"
import { fetchAllThreats } from "@/lib/api/threats"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AnalysisPage() {
  const [allThreats, setAllThreats] = React.useState<Threat[]>([])
  const [filteredThreats, setFilteredThreats] = React.useState<Threat[]>([])
  const [selectedThreat, setSelectedThreat] = React.useState<Threat | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch all threats when component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const threats = await fetchAllThreats()
        setAllThreats(threats)
        setFilteredThreats(threats)

        // Select the first threat if none is selected
        if (threats.length > 0 && !selectedThreat) {
          setSelectedThreat(threats[0])
        }
      } catch (err) {
        setError("Failed to fetch threat data. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter threats based on search term
  React.useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredThreats(allThreats)
    } else {
      const lowercaseSearch = searchTerm.toLowerCase()
      const filtered = allThreats.filter(
        (threat) =>
          threat.title.toLowerCase().includes(lowercaseSearch) ||
          threat.content.toLowerCase().includes(lowercaseSearch) ||
          threat.username.toLowerCase().includes(lowercaseSearch),
      )
      setFilteredThreats(filtered)
    }
  }, [searchTerm, allThreats])

  // Function to handle threat selection
  const handleSelectThreat = (threat: Threat) => {
    setSelectedThreat(threat)
  }

  // Show loading state
  if (isLoading && filteredThreats.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        {/* CHANGE: Updated width from 2/5 to 1/4 (25%) for loading skeleton */}
        <div className="w-1/4 border-r flex flex-col">
          <div className="p-4 border-b">
            <Skeleton className="h-10 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
          <div className="flex-1 p-4 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* CHANGE: Updated width from 3/5 to 3/4 (75%) for loading skeleton */}
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* CHANGE: Updated width from 2/5 to 1/4 (25%) for threat list */}
      <div className="w-1/4 border-r">
        <ThreatList
          threats={filteredThreats}
          selectedThreat={selectedThreat}
          onSelectThreat={handleSelectThreat}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isLoading={isLoading}
        />
      </div>
      {/* CHANGE: Updated width from 3/5 to 3/4 (75%) for threat detail */}
      <div className="w-3/4">
        {selectedThreat && <ThreatDetail threat={selectedThreat} />}
      </div>
    </div>
  )
}

