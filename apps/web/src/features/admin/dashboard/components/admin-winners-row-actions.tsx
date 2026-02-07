import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { type WinnerWithDetails } from '../types/winner'
import { deleteWinner } from '@/services/admin'

type AdminWinnersRowActionsProps<TData> = {
  row: Row<TData>
}

export function AdminWinnersRowActions<TData>({
  row,
}: AdminWinnersRowActionsProps<TData>) {
  const winner = row.original as WinnerWithDetails
  const queryClient = useQueryClient()
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: (winnerId: string) => deleteWinner(winnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winners'] })
      toast.success('Winner removed successfully')
      setShowDeleteAlert(false)
    },
    onError: (error) => {
      toast.error('Failed to remove winner')
      console.error(error)
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(winner.id)
  }

  return (
    <>
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
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            <Trash2 className='mr-2 h-4 w-4' />
            Remove
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              winner announcement for "{winner.project_title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
