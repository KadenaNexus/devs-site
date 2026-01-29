import { createFileRoute } from '@tanstack/react-router'
import { JudgesManagement } from '@/features/admin/dashboard/judges-management'
import { useAdminStore } from '@/stores/admin-store'

export const Route = createFileRoute('/_authenticated/admin/judges/')({
  beforeLoad: () => {
    const { isAuthenticated } = useAdminStore.getState()
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }
  },
  component: JudgesManagement,
})
