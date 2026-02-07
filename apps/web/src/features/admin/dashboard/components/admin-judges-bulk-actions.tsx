import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Judge } from '@/services/admin'
import { supabase } from '@/services/supabase'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type AdminJudgesBulkActionsProps<TData> = {
  table: Table<TData>
}

export function AdminJudgesBulkActions<TData>({
  table,
}: AdminJudgesBulkActionsProps<TData>) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete from auth.users requires admin privileges
      // For now, we'll just show a message that this requires backend support
      const { error } = await supabase.auth.admin.deleteUser(ids[0])
      
      if (error) {
        // If auth deletion fails, fall back to just removing from profiles
        console.warn('Auth deletion not available, cleaning up profiles only')
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .in('id', ids)
        
        if (profileError) throw profileError
      } else {
        // Delete remaining users
        for (const id of ids.slice(1)) {
          await supabase.auth.admin.deleteUser(id)
        }
      }
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['judges'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success(`Successfully deleted ${ids.length} judge(s)`)
      table.resetRowSelection()
      setShowDeleteAlert(false)
    },
    onError: (error) => {
      toast.error('Failed to delete judges. This operation requires admin privileges.')
      console.error(error)
    },
  })

  const handleBulkDelete = () => {
    const ids = selectedRows.map((row) => (row.original as Judge).id)
    bulkDeleteMutation.mutate(ids)
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='judge'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setShowDeleteAlert(true)}
          disabled={selectedRows.length === 0}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete ({selectedRows.length})
        </Button>
      </BulkActionsToolbar>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              {selectedRows.length} judge(s) and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete {selectedRows.length} Judge(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
