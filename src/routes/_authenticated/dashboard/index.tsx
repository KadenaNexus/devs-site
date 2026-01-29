import { createFileRoute } from '@tanstack/react-router'
import { PublicDashboard } from '@/features/dashboard/public-dashboard'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: PublicDashboard,
})
