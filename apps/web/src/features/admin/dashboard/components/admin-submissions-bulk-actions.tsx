import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type SubmissionWithDetails } from '../types/submission'
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

type AdminSubmissionsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function AdminSubmissionsBulkActions<TData>({
  table,
}: AdminSubmissionsBulkActionsProps<TData>) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .in('id', ids)

      if (error) throw error
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['submissions-with-details'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success(`Successfully deleted ${ids.length} submission(s)`)
      table.resetRowSelection()
      setShowDeleteAlert(false)
    },
    onError: (error) => {
      toast.error('Failed to delete submissions')
      console.error(error)
    },
  })

  const handleBulkDelete = () => {
    const ids = selectedRows.map((row) => (row.original as SubmissionWithDetails).id)
    bulkDeleteMutation.mutate(ids)
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='submission'>
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
              {selectedRows.length} submission(s) and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete {selectedRows.length} Submission(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
