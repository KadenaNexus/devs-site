import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, Eye } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { challengeSchema } from '../data/schema'
import { useChallenges } from './challenges-provider'
import { supabase } from '@/services/supabase'
import { useAdminStore } from '@/stores/admin-store'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const challenge = challengeSchema.parse(row.original)
  const { setOpen, setCurrentRow } = useChallenges()
  const { isAuthenticated: isAdmin } = useAdminStore()
  const navigate = useNavigate()

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

  // Only admins can edit/delete challenges
  const canManageChallenges = isAdmin || userRole === 'admin'

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            navigate({
              to: '/challenges/$id/submissions',
              params: { id: challenge.id },
            })
          }}
        >
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        {canManageChallenges && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(challenge)
                setOpen('update')
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(challenge)
                setOpen('delete')
              }}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
