import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Check, X, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type SubmissionWithDetails } from '../types/submission'
import {
  approveSubmission,
  rejectSubmission,
  toggleSubmissionVisibility,
} from '@/services/admin'

type AdminSubmissionsRowActionsProps<TData> = {
  row: Row<TData>
  onViewDetails?: (submission: SubmissionWithDetails) => void
}

export function AdminSubmissionsRowActions<TData>({
  row,
  onViewDetails,
}: AdminSubmissionsRowActionsProps<TData>) {
  const submission = row.original as SubmissionWithDetails
  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-with-details'] })
      toast.success('Submission approved')
    },
    onError: (error) => {
      toast.error('Failed to approve submission')
      console.error(error)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-with-details'] })
      toast.success('Submission rejected')
    },
    onError: (error) => {
      toast.error('Failed to reject submission')
      console.error(error)
    },
  })

  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      toggleSubmissionVisibility(id, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-with-details'] })
      toast.success('Visibility updated')
    },
    onError: (error) => {
      toast.error('Failed to update visibility')
      console.error(error)
    },
  })

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
      <DropdownMenuContent align='end' className='w-45'>
        <DropdownMenuItem onClick={() => onViewDetails?.(submission)}>
          <ExternalLink className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {submission.status !== 'approved' && (
          <DropdownMenuItem onClick={() => approveMutation.mutate(submission.id)}>
            <Check className='mr-2 h-4 w-4' />
            Approve
          </DropdownMenuItem>
        )}
        {submission.status !== 'rejected' && (
          <DropdownMenuItem onClick={() => rejectMutation.mutate(submission.id)}>
            <X className='mr-2 h-4 w-4' />
            Reject
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            toggleVisibilityMutation.mutate({
              id: submission.id,
              isPublic: !submission.is_public,
            })
          }
        >
          {submission.is_public ? (
            <>
              <EyeOff className='mr-2 h-4 w-4' />
              Make Private
            </>
          ) : (
            <>
              <Eye className='mr-2 h-4 w-4' />
              Make Public
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
