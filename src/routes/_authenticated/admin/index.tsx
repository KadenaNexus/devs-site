import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAdminStore } from '@/stores/admin-store'

export const Route = createFileRoute('/_authenticated/admin/')({
  beforeLoad: () => {
    const { isAuthenticated } = useAdminStore.getState()
    if (!isAuthenticated) {
      throw redirect({ to: '/admin' })
    }
  },
  component: () => {
    // Redirect to dashboard
    return null
  },
})
