import { AdminDashboard } from '@/features/admin/admin-dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin-dashboard/')({
  component: AdminDashboard,
})