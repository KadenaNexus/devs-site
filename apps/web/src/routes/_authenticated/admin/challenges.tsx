import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChallengesManagement } from '@/features/admin/dashboard/challenges-management'
import { supabase } from '@/services/supabase'

export const Route = createFileRoute('/_authenticated/admin/challenges')({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role?.toLowerCase()
    
    if (role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: ChallengesManagement,
})
