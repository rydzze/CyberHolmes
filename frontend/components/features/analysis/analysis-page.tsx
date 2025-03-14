"use client"

import * as React from "react"
import { ThreatList } from "@/components/features/analysis/threat-list"
import { ThreatDetail } from "@/components/features/analysis/threat-detail"
import { threatData } from "@/lib/data/threat-data"

export function AnalysisPage() {
  const [selectedThreat, setSelectedThreat] = React.useState(threatData[0])
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredThreats = threatData.filter(
    (threat) =>
      threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFlag = (id) => {
    const updatedThreats = threatData.map((threat) => {
      if (threat.id === id) {
        return { ...threat, isFlagged: !threat.isFlagged }
      }
      return threat
    })

    // Update the selected threat if it's the one being flagged/unflagged
    if (selectedThreat.id === id) {
      setSelectedThreat({ ...selectedThreat, isFlagged: !selectedThreat.isFlagged })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ThreatList
        threats={filteredThreats}
        selectedThreat={selectedThreat}
        onSelectThreat={setSelectedThreat}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <ThreatDetail threat={selectedThreat} onToggleFlag={toggleFlag} />
    </div>
  )
}
