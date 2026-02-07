import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSubmissionsWithDetails,
  approveSubmission,
  rejectSubmission,
  toggleSubmissionVisibility,
  fetchSubmissionScores,
} from '@/services/admin'
import { fetchChallenges } from '@/services/challenges'
import { Trophy, ExternalLink, Check, X, Eye, EyeOff, Award, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { AdminSubmissionsTable } from './components/admin-submissions-table'
import { type SubmissionWithDetails } from './types/submission'
export function SubmissionsManagement() {
  const queryClient = useQueryClient()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null)

  // Fetch individual scores when a submission is selected
  const { data: individualScores = [] } = useQuery({
    queryKey: ['submission-scores', selectedSubmission?.id],
    queryFn: () => fetchSubmissionScores(selectedSubmission!.id),
    enabled: !!selectedSubmission,
  })

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
    const variants: Record<
      string,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
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

  const handleCloseSheet = () => {
    setSelectedSubmission(null)
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <Trophy className='h-5 w-5' />
          <span className='font-semibold'>Admin</span>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Submissions Management</CardTitle>
              <div className='w-64'>
                <select
                  className='border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
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
              <AdminSubmissionsTable
                data={submissions}
                onViewDetails={(submission) => setSelectedSubmission(submission)}
              />
            )}
          </CardContent>

          {/* Submission Detail Sheet */}
          <Sheet open={!!selectedSubmission} onOpenChange={handleCloseSheet}>
            <SheetContent className='w-full overflow-y-auto p-0 sm:max-w-2xl lg:max-w-4xl'>
              {selectedSubmission && (
                <>
                  <SheetHeader className='space-y-3 border-b p-6 sm:p-8'>
                    <SheetTitle className='text-2xl'>{selectedSubmission.project_title}</SheetTitle>
                    <SheetDescription className='text-base'>
                      Comprehensive submission details and scoring breakdown
                    </SheetDescription>
                  </SheetHeader>

                  <div className='space-y-8 p-6 pb-8 sm:p-8'>
                    {/* Basic Info */}
                    <div className='grid gap-6 sm:grid-cols-2'>
                      <div className='space-y-4'>
                        <div className='space-y-1.5'>
                          <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                            Challenge
                          </label>
                          <p className='text-base font-medium'>
                            {selectedSubmission.challenge_name || 'N/A'}
                          </p>
                        </div>
                        <div className='space-y-1.5'>
                          <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                            Developer
                          </label>
                          <p className='text-base font-medium'>
                            {selectedSubmission.developer_name}
                          </p>
                        </div>
                        <div className='space-y-1.5'>
                          <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                            Email
                          </label>
                          <p className='text-sm'>
                            {selectedSubmission.email}
                          </p>
                        </div>
                        {selectedSubmission.discord && (
                          <div className='space-y-1.5'>
                            <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                              Discord
                            </label>
                            <p className='text-sm'>
                              {selectedSubmission.discord}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className='space-y-4'>
                        <div className='space-y-1.5'>
                          <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                            Status
                          </label>
                          <div>
                            {getStatusBadge(selectedSubmission.status)}
                          </div>
                        </div>
                        <div className='space-y-1.5'>
                          <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                            Visibility
                          </label>
                          <div>
                            <Badge
                              variant={
                                selectedSubmission.is_public
                                  ? 'default'
                                  : 'secondary'
                              }
                              className='text-xs'
                            >
                              {selectedSubmission.is_public
                                ? 'Public'
                                : 'Private'}
                            </Badge>
                          </div>
                        </div>
                        <div className='space-y-1.5'>
                          <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                            Submitted Date
                          </label>
                          <p className='text-sm'>
                            {new Date(
                              selectedSubmission.created_at
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Project Links */}
                    {(selectedSubmission.github_url || selectedSubmission.demo_url) && (
                      <div className='space-y-4'>
                        <h3 className='text-sm font-semibold'>Project Links</h3>
                        <div className='grid gap-3 sm:grid-cols-2'>
                          {selectedSubmission.github_url && (
                            <a
                              href={selectedSubmission.github_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='bg-muted hover:bg-muted/80 group flex items-center gap-3 rounded-lg border p-4 transition-colors'
                            >
                              <div className='bg-background flex h-10 w-10 items-center justify-center rounded-md'>
                                <ExternalLink className='h-5 w-5' />
                              </div>
                              <div className='flex-1 overflow-hidden'>
                                <p className='text-xs font-medium text-muted-foreground'>GitHub Repository</p>
                                <p className='text-primary group-hover:underline truncate text-sm'>
                                  View Code
                                </p>
                              </div>
                            </a>
                          )}
                          {selectedSubmission.demo_url && (
                            <a
                              href={selectedSubmission.demo_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='bg-muted hover:bg-muted/80 group flex items-center gap-3 rounded-lg border p-4 transition-colors'
                            >
                              <div className='bg-background flex h-10 w-10 items-center justify-center rounded-md'>
                                <ExternalLink className='h-5 w-5' />
                              </div>
                              <div className='flex-1 overflow-hidden'>
                                <p className='text-xs font-medium text-muted-foreground'>Live Demo</p>
                                <p className='text-primary group-hover:underline truncate text-sm'>
                                  View Demo
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Problem Statement */}
                    {selectedSubmission.problem_statement && (
                      <div className='space-y-3'>
                        <h3 className='text-sm font-semibold'>Problem Statement</h3>
                        <div className='bg-muted/50 rounded-lg border p-4'>
                          <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                            {selectedSubmission.problem_statement}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Solution Description */}
                    {selectedSubmission.solution_description && (
                      <div className='space-y-3'>
                        <h3 className='text-sm font-semibold'>Solution Description</h3>
                        <div className='bg-muted/50 rounded-lg border p-4'>
                          <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                            {selectedSubmission.solution_description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Smart Contract Details */}
                    {selectedSubmission.smart_contract_details && (
                      <div className='space-y-3'>
                        <h3 className='text-sm font-semibold'>Smart Contract Details</h3>
                        <div className='bg-muted/50 rounded-lg border p-4'>
                          <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                            {selectedSubmission.smart_contract_details}
                          </p>
                        </div>
                      </div>
                    )}

                    <Separator className='my-8' />

                    {/* Scoring Information */}
                    <div>
                      <div className='mb-6 flex items-center gap-3'>
                        <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                          <Award className='h-5 w-5 text-primary' />
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold'>
                            Scoring Evaluation
                          </h3>
                          <p className='text-muted-foreground text-sm'>
                            Judge assessments and final score
                          </p>
                        </div>
                      </div>

                      {individualScores.length > 0 ? (
                        <div className='space-y-8'>
                          {/* Individual Judge Scores */}
                          <div className='space-y-6'>
                            <div className='bg-muted/30 rounded-lg border p-5'>
                              <p className='text-muted-foreground text-sm leading-relaxed'>
                                <span className='font-semibold'>Scoring Criteria:</span> Each judge evaluates five key areas—Impact, Execution, Innovation, Security, and UX/Clarity—on a scale of 0-100 points. The final score is the average across all judges.
                              </p>
                            </div>
                            
                            <div className='grid gap-4 lg:grid-cols-2'>
                              {individualScores.map((score, index) => (
                                <div 
                                  key={score.id} 
                                  className='group rounded-xl border-2 bg-card transition-all hover:shadow-md'
                                >
                                  {/* Judge Header */}
                                  <div className='flex items-center justify-between border-b bg-muted/20 p-4'>
                                    <div className='flex items-center gap-2.5'>
                                      <div className='bg-primary flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground text-sm font-bold shadow-sm'>
                                        {index + 1}
                                      </div>
                                      <div>
                                        <p className='font-semibold text-sm'>{score.judge_name}</p>
                                        <p className='text-muted-foreground text-xs'>
                                          {new Date(score.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <div className='text-right'>
                                      <p className='text-2xl font-bold tabular-nums'>{score.total}</p>
                                      <p className='text-muted-foreground text-xs font-medium'>/ 500</p>
                                    </div>
                                  </div>

                                  {/* Criteria Breakdown */}
                                  <div className='space-y-3.5 p-4'>
                                    {[
                                      { label: 'Impact', value: score.impact },
                                      { label: 'Execution', value: score.execution },
                                      { label: 'Innovation', value: score.innovation },
                                      { label: 'Security', value: score.security },
                                      { label: 'UX & Clarity', value: score.ux_clarity },
                                    ].map((criterion, idx) => (
                                      <div key={idx} className='space-y-1.5'>
                                        <div className='flex items-center justify-between'>
                                          <span className='text-xs font-medium'>{criterion.label}</span>
                                          <span className='text-xs font-semibold tabular-nums'>
                                            {criterion.value}<span className='text-muted-foreground'>/100</span>
                                          </span>
                                        </div>
                                        <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
                                          <div 
                                            className='h-full rounded-full bg-primary transition-all duration-500'
                                            style={{ width: `${criterion.value}%` }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Judge Notes */}
                                  {score.notes && (
                                    <div className='border-t bg-muted/10 p-4'>
                                      <div className='flex items-start gap-2'>
                                        <div className='bg-background flex h-6 w-6 shrink-0 items-center justify-center rounded'>
                                          <span className='text-xs'>💬</span>
                                        </div>
                                        <div className='flex-1'>
                                          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2'>
                                            Feedback
                                          </p>
                                          <p className='text-xs leading-relaxed whitespace-pre-wrap'>
                                            {score.notes}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Final Average Score */}
                          <div className='rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-8 shadow-sm'>
                            <div className='mb-5 flex items-start justify-between gap-4'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <TrendingUp className='h-5 w-5 text-primary' />
                                  <p className='text-base font-semibold'>Final Average Score</p>
                                </div>
                                <p className='text-muted-foreground text-sm'>
                                  Based on <span className='font-semibold'>{individualScores.length}</span> judge evaluation{individualScores.length > 1 ? 's' : ''} • <span className='font-semibold'>{individualScores.length * 5}</span> total criteria assessed
                                </p>
                              </div>
                              <div className='text-right'>
                                <p className='text-5xl font-bold text-primary tabular-nums'>
                                  {selectedSubmission.average_score.toFixed(1)}
                                </p>
                                <p className='text-muted-foreground text-sm font-semibold mt-1'>
                                  out of 100
                                </p>
                              </div>
                            </div>
                            
                            <div className='relative h-4 w-full overflow-hidden rounded-full bg-background/50'>
                              <div 
                                className='h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700'
                                style={{ width: `${selectedSubmission.average_score}%` }}
                              />
                            </div>
                            
                            {/* Scoring Logic Explanation */}
                            <details className='mt-8 group/details'>
                              <summary className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide transition-colors'>
                                <span>📊 View Calculation Details</span>
                                <svg className='h-4 w-4 transition-transform group-open/details:rotate-90' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                              </summary>
                              <div className='bg-background mt-5 rounded-lg border p-5'>
                                <p className='text-muted-foreground mb-4 text-xs font-semibold'>
                                  How the final average is calculated:
                                </p>
                                <ol className='text-muted-foreground space-y-2.5 text-xs leading-relaxed'>
                                  <li className='flex gap-3'>
                                    <span className='font-semibold'>1.</span>
                                    <span>Each judge scores 5 criteria (Impact, Execution, Innovation, Security, UX/Clarity) from 0-100 points each</span>
                                  </li>
                                  <li className='flex gap-3'>
                                    <span className='font-semibold'>2.</span>
                                    <span>Maximum possible score per judge: <strong className='text-foreground'>500 points</strong> (5 criteria × 100)</span>
                                  </li>
                                  <li className='flex gap-3'>
                                    <span className='font-semibold'>3.</span>
                                    <span>Sum all scores from all judges: <strong className='text-foreground'>{individualScores.reduce((sum, s) => sum + s.total, 0)} points</strong></span>
                                  </li>
                                  <li className='flex gap-3'>
                                    <span className='font-semibold'>4.</span>
                                    <span>Divide by number of judges: <strong className='text-foreground'>{individualScores.reduce((sum, s) => sum + s.total, 0)} ÷ {individualScores.length} = {(individualScores.reduce((sum, s) => sum + s.total, 0) / individualScores.length).toFixed(2)}</strong></span>
                                  </li>
                                  <li className='flex gap-3'>
                                    <span className='font-semibold'>5.</span>
                                    <span>Normalize to 100-point scale: <strong className='text-foreground'>{(individualScores.reduce((sum, s) => sum + s.total, 0) / individualScores.length).toFixed(2)} ÷ 5 = {selectedSubmission.average_score.toFixed(2)}</strong></span>
                                  </li>
                                </ol>
                              </div>
                            </details>
                          </div>
                        </div>
                      ) : (
                        <div className='rounded-xl border-2 border-dashed p-12 text-center'>
                          <div className='bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                            <Award className='text-muted-foreground h-8 w-8' />
                          </div>
                          <p className='text-foreground mb-2 font-semibold'>
                            No Evaluations Yet
                          </p>
                          <p className='text-muted-foreground mx-auto max-w-sm text-sm'>
                            This submission hasn't been evaluated by any judges yet. Scores will appear here once judges complete their assessments.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className='space-y-3 border-t pt-8'>
                      {selectedSubmission.status === 'pending' && (
                        <div className='grid gap-3 sm:grid-cols-2'>
                          <Button
                            size='lg'
                            onClick={() => {
                              approveMutation.mutate(selectedSubmission.id)
                              handleCloseSheet()
                            }}
                            className='font-semibold'
                          >
                            <Check className='mr-2 h-4 w-4' />
                            Approve Submission
                          </Button>
                          <Button
                            size='lg'
                            variant='destructive'
                            onClick={() => {
                              rejectMutation.mutate(selectedSubmission.id)
                              handleCloseSheet()
                            }}
                            className='font-semibold'
                          >
                            <X className='mr-2 h-4 w-4' />
                            Reject Submission
                          </Button>
                        </div>
                      )}
                      <Button
                        size='lg'
                        variant='outline'
                        className='w-full font-semibold'
                        onClick={() => {
                          toggleVisibilityMutation.mutate({
                            id: selectedSubmission.id,
                            isPublic: !selectedSubmission.is_public,
                          })
                        }}
                      >
                        {selectedSubmission.is_public ? (
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
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </Card>
      </Main>
    </>
  )
}
