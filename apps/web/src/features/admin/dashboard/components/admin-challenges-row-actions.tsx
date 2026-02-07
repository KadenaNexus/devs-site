import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Lock, Unlock, Edit, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { challengeSchema, type Challenge } from '@/features/challenges/data/schema'
import { deleteChallenge, toggleChallengeStatus } from '@/services/admin'
import { useState } from 'react'
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

type AdminChallengesRowActionsProps<TData> = {
  row: Row<TData>
  onEdit?: (challenge: Challenge) => void
}

export function AdminChallengesRowActions<TData>({
  row,
  onEdit,
}: AdminChallengesRowActionsProps<TData>) {
  const challenge = challengeSchema.parse(row.original)
  const queryClient = useQueryClient()
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Challenge deleted successfully')
      setShowDeleteAlert(false)
    },
    onError: (error) => {
      toast.error('Failed to delete challenge')
      console.error(error)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'open' | 'closed' }) =>
      toggleChallengeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Challenge status updated')
    },
    onError: (error) => {
      toast.error('Failed to update challenge status')
      console.error(error)
    },
  })

  const handleToggleStatus = () => {
    const newStatus = challenge.status === 'open' ? 'closed' : 'open'
    toggleStatusMutation.mutate({ id: challenge.id, status: newStatus })
  }

  const handleDelete = () => {
    deleteMutation.mutate(challenge.id)
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
          <DropdownMenuItem onClick={() => onEdit?.(challenge)}>
            <Edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            {challenge.status === 'open' ? (
              <>
                <Lock className='mr-2 h-4 w-4' />
                Close
              </>
            ) : (
              <>
                <Unlock className='mr-2 h-4 w-4' />
                Open
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              challenge "{challenge.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
