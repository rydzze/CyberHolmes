"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function ProfileModal() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleOpenModal = () => setOpen(true)
    window.addEventListener("open-profile-modal", handleOpenModal)
    return () => window.removeEventListener("open-profile-modal", handleOpenModal)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>View and update your profile information</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img src="/placeholder.svg?height=96&width=96" alt="Profile" className="h-full w-full object-cover" />
            </div>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </Button>
          </div>
          <h3 className="mt-2 font-medium">John Doe</h3>
          <p className="text-sm text-muted-foreground">Threat Intelligence Analyst</p>
        </div>

        <Separator />

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" defaultValue="john@example.com" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input id="role" defaultValue="Threat Intelligence Analyst" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input id="department" defaultValue="Security Operations" className="col-span-3" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
