import { createFileRoute } from '@tanstack/react-router'
import { useAdminStore } from '@/stores/admin-store'
import { JudgeDetail } from '@/features/admin/dashboard/judge-detail'

export const Route = createFileRoute('/_authenticated/admin/judges/$judgeId')({
  beforeLoad: () => {
    const { isAuthenticated } = useAdminStore.getState()
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }
  },
  component: JudgeDetail,
})
