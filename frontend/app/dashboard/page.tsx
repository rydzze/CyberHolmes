import { DashboardPage } from "@/components/features/dashboard/dashboard-page"
import { AppLayout } from "@/components/layout/app-layout"

export default function Page() {
  return (
    <AppLayout title="Dashboard">
      <DashboardPage />
    </AppLayout>
  )
}

