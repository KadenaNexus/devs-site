import { createFileRoute } from '@tanstack/react-router'
import { SubmissionsManagement } from '@/features/admin/dashboard/submissions-management'
import { useAdminStore } from '@/stores/admin-store'

export const Route = createFileRoute('/_authenticated/admin/submissions')({
  beforeLoad: () => {
    const { isAuthenticated } = useAdminStore.getState()
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }
  },
  component: SubmissionsManagement,
})
