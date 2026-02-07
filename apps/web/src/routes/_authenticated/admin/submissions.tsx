import { createFileRoute, redirect } from '@tanstack/react-router'
import { SubmissionsManagement } from '@/features/admin/dashboard/submissions-management'
import { supabase } from '@/services/supabase'

export const Route = createFileRoute('/_authenticated/admin/submissions')({  
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role?.toLowerCase()
    
    if (role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SubmissionsManagement,
})
