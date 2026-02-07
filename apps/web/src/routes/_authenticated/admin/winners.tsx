import { createFileRoute, redirect } from '@tanstack/react-router'
import { WinnersManagement } from '@/features/admin/dashboard/winners-management'
import { supabase } from '@/services/supabase'

export const Route = createFileRoute('/_authenticated/admin/winners')({  
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role?.toLowerCase()
    
    if (role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: WinnersManagement,
})
