import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/services/supabase'

export const Route = createFileRoute('/_authenticated/admin/')({  
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role?.toLowerCase()
    
    if (role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
    
    // Redirect to admin dashboard
    throw redirect({ to: '/admin/dashboard' })
  },
})

