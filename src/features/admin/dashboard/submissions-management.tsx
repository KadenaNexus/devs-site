import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchChallenges } from '@/services/challenges'
import {
  fetchSubmissionsWithDetails,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Check, X, Eye, EyeOff, ExternalLink } from 'lucide-react'

export function SubmissionsManagement() {
  const queryClient = useQueryClient()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const itemsPerPage = 10

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions-with-details', selectedChallengeId],
    queryFn: () => 
      selectedChallengeId === 'all' 
        ? fetchSubmissionsWithDetails() 
        : fetchSubmissionsWithDetails(selectedChallengeId),
  })

  // Pagination logic
  const totalPages = Math.ceil(submissions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSubmissions = submissions.slice(startIndex, endIndex)

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

  const handleRowClick = (submission: any) => {
    setSelectedSubmission(submission)
  }

  const handleCloseSheet = () => {
    setSelectedSubmission(null)
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
              <option value='all'>All Submissions</option>
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
        {isLoading ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>No submissions yet</p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Challenge Name</TableHead>
                    <TableHead>Judge Name</TableHead>
                    <TableHead>Developer Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Average Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubmissions.map((submission) => (
                  <TableRow 
                    key={submission.id}
                    onClick={() => handleRowClick(submission)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className='font-medium'>
                      {submission.challenge_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {submission.judge_names || 'Not scored yet'}
                    </TableCell>
                    <TableCell>{submission.developer_name}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      {submission.average_score !== null 
                        ? submission.average_score.toFixed(2) 
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>

            {/* Pagination Controls */}
            <div className='flex items-center justify-between px-2 py-4'>
              <div className='text-sm text-muted-foreground'>
                Showing {startIndex + 1} to {Math.min(endIndex, submissions.length)} of {submissions.length} submissions
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Submission Detail Sheet */}
      <Sheet open={!!selectedSubmission} onOpenChange={handleCloseSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedSubmission && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedSubmission.project_title}</SheetTitle>
                <SheetDescription>
                  Submission Details
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Challenge</label>
                    <p className="text-sm">{selectedSubmission.challenge_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Developer</label>
                    <p className="text-sm">{selectedSubmission.developer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedSubmission.developer_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                    <div className="mt-1">
                      <Badge variant={selectedSubmission.is_public ? 'default' : 'secondary'}>
                        {selectedSubmission.is_public ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                    <p className="text-sm">
                      {new Date(selectedSubmission.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Repository Link */}
                {selectedSubmission.repository_link && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Repository</label>
                    <a
                      href={selectedSubmission.repository_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline mt-1"
                    >
                      {selectedSubmission.repository_link}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Description */}
                {selectedSubmission.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{selectedSubmission.description}</p>
                  </div>
                )}

                {/* Scoring Information */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-3">Scoring Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Judges</label>
                      <p className="text-sm">{selectedSubmission.judge_names || 'Not scored yet'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Average Score</label>
                      <p className="text-lg font-semibold">
                        {selectedSubmission.average_score !== null 
                          ? `${selectedSubmission.average_score.toFixed(2)} / 5.00` 
                          : 'Not scored yet'}
                      </p>
                    </div>
                    {selectedSubmission.score_count > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Scores</label>
                        <p className="text-sm">{selectedSubmission.score_count} judge(s) scored this submission</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4 space-y-3">
                  {selectedSubmission.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          approveMutation.mutate(selectedSubmission.id)
                          handleCloseSheet()
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          rejectMutation.mutate(selectedSubmission.id)
                          handleCloseSheet()
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toggleVisibilityMutation.mutate({
                        id: selectedSubmission.id,
                        isPublic: !selectedSubmission.is_public,
                      })
                    }}
                  >
                    {selectedSubmission.is_public ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Make Private
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Make Public
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  )
}
