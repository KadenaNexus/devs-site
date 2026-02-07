import { useQuery } from '@tanstack/react-query'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChallenges } from './challenges-provider'
import { supabase } from '@/services/supabase'
import { useAdminStore } from '@/stores/admin-store'

export function ChallengesPrimaryButtons() {
  const { setOpen } = useChallenges()
  const { isAuthenticated: isAdmin } = useAdminStore()

  // Get user role
  const { data: userRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return (user?.user_metadata?.role as string | undefined)?.toLowerCase() || null
    },
    staleTime: 5 * 60 * 1000,
  })

  // Only admins can create/import challenges
  const canManageChallenges = isAdmin || userRole === 'admin'

  if (!canManageChallenges) {
    return null
  }

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <Download size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create</span> <Plus size={18} />
      </Button>
    </div>
  )
}
