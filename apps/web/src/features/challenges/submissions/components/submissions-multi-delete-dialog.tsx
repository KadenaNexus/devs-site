import { type Table } from '@tanstack/react-table'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/services/supabase'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { type Submission } from '../../data/submissions-schema'

type SubmissionsMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function SubmissionsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: SubmissionsMultiDeleteDialogProps<TData>) {
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedSubmissions = selectedRows.map((row) => row.original as Submission)

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .in('id', ids)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      table.resetRowSelection()
      onOpenChange(false)
      toast.success(`Successfully deleted ${selectedSubmissions.length} submission${selectedSubmissions.length > 1 ? 's' : ''}`)
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete submissions: ${error.message}`)
    },
  })

  const handleDelete = () => {
    const ids = selectedSubmissions.map((s) => s.id)
    deleteMutation.mutate(ids)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedSubmissions.length} submission{selectedSubmissions.length > 1 ? 's' : ''}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected submissions and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
