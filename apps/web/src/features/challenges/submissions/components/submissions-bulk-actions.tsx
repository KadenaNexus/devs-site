import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { useAdminStore } from '@/stores/admin-store'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { SubmissionsMultiDeleteDialog } from './submissions-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
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

  // Only admins can bulk delete
  const canBulkDelete = isAdmin || userRole === 'admin'

  // If not admin, don't show bulk actions
  if (!canBulkDelete) {
    return null
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='submission'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected submissions'
              title='Delete selected submissions'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected submissions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected submissions</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <SubmissionsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
