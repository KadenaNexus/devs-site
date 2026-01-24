import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchChallenges, fetchSubmissions } from '@/services/challenges'
import {
  approveSubmission,
  rejectSubmission,
  toggleSubmissionVisibility,
} from '@/services/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Check, X, Eye, EyeOff } from 'lucide-react'

export function SubmissionsManagement() {
  const queryClient = useQueryClient()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('')

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions', selectedChallengeId],
    queryFn: () => fetchSubmissions(selectedChallengeId),
    enabled: !!selectedChallengeId,
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
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
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
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
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      toast.success('Visibility updated')
    },
    onError: (error) => {
      toast.error('Failed to update visibility')
      console.error(error)
    },
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      approved: 'default',
      rejected: 'destructive',
      pending: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Submissions Management</CardTitle>
          <div className='w-64'>
            <select
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
            >
              <option value=''>Select a challenge</option>
              {challenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedChallengeId ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>
              Select a challenge to view submissions
            </p>
          </div>
        ) : isLoading ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>No submissions yet</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className='font-medium'>
                      {submission.project_title}
                    </TableCell>
                    <TableCell>{submission.developer_name}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      <Badge variant={submission.is_public ? 'default' : 'secondary'}>
                        {submission.is_public ? 'Public' : 'Private'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(submission.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        {submission.status === 'pending' && (
                          <>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                approveMutation.mutate(submission.id)
                              }
                              title='Approve'
                            >
                              <Check className='h-4 w-4 text-green-600' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                rejectMutation.mutate(submission.id)
                              }
                              title='Reject'
                            >
                              <X className='h-4 w-4 text-red-600' />
                            </Button>
                          </>
                        )}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() =>
                            toggleVisibilityMutation.mutate({
                              id: submission.id,
                              isPublic: !submission.is_public,
                            })
                          }
                          title={
                            submission.is_public
                              ? 'Make Private'
                              : 'Make Public'
                          }
                        >
                          {submission.is_public ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
