import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type WinnerWithDetails } from '../types/winner'
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

type AdminWinnersBulkActionsProps<TData> = {
  table: Table<TData>
}

export function AdminWinnersBulkActions<TData>({
  table,
}: AdminWinnersBulkActionsProps<TData>) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('winners')
        .delete()
        .in('id', ids)

      if (error) throw error
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['winners'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success(`Successfully removed ${ids.length} winner(s)`)
      table.resetRowSelection()
      setShowDeleteAlert(false)
    },
    onError: (error) => {
      toast.error('Failed to remove winners')
      console.error(error)
    },
  })

  const handleBulkDelete = () => {
    const ids = selectedRows.map((row) => (row.original as WinnerWithDetails).id)
    bulkDeleteMutation.mutate(ids)
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='winner'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setShowDeleteAlert(true)}
          disabled={selectedRows.length === 0}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Remove ({selectedRows.length})
        </Button>
      </BulkActionsToolbar>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{' '}
              {selectedRows.length} winner announcement(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Remove {selectedRows.length} Winner(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
