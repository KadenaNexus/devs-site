import { createFileRoute } from '@tanstack/react-router'
import { WinnersManagement } from '@/features/admin/dashboard/winners-management'
import { useAdminStore } from '@/stores/admin-store'

export const Route = createFileRoute('/_authenticated/admin/winners')({
  beforeLoad: () => {
    const { isAuthenticated } = useAdminStore.getState()
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }
  },
  component: WinnersManagement,
})
