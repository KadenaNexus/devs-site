import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/services/supabase'
import { JudgeDetail } from '@/features/admin/dashboard/judge-detail'

export const Route = createFileRoute('/_authenticated/admin/judges/$judgeId')({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role?.toLowerCase()
    
    if (role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: JudgeDetail,
})
