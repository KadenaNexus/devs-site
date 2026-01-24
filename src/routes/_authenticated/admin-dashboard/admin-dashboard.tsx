import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '@/features/admin/admin-dashboard'
import { useAdminStore } from '@/stores/admin-store'

export const Route = createFileRoute('/_authenticated/admin-dashboard/admin-dashboard')({
  beforeLoad: () => {
    const { isAuthenticated } = useAdminStore.getState()
    if (!isAuthenticated) {
      throw new Error('Unauthorized')
    }
  },
  component: AdminDashboard,
  errorComponent: () => (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Unauthorized</h1>
        <p className='text-gray-600 mt-2'>Please log in to access the admin dashboard</p>
      </div>
    </div>
  ),
})