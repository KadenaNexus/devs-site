import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminDashboard } from '@/features/admin/dashboard'
import { supabase } from '@/services/supabase'

export const Route = createFileRoute('/_authenticated/admin/dashboard')({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role?.toLowerCase()
    
    if (role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AdminDashboard,
})

