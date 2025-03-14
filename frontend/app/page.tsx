import { AppLayout } from "@/components/layout/app-layout"
import { DashboardPage } from "@/components/features/dashboard/dashboard-page"

export default function Page() {
  return (
    <AppLayout title="Dashboard">
      <DashboardPage />
    </AppLayout>
  )
}

