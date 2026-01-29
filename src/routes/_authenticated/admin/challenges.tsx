import { createFileRoute } from '@tanstack/react-router'
import { ChallengesManagement } from '@/features/admin/dashboard/challenges-management'
import { useAdminStore } from '@/stores/admin-store'

export const Route = createFileRoute('/_authenticated/admin/challenges')({
  beforeLoad: () => {
    const { isAuthenticated } = useAdminStore.getState()
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }
  },
  component: ChallengesManagement,
})
