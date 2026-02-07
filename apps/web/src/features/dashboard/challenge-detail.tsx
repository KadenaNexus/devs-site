import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { fetchChallenge } from '@/services/challenges'
import { fetchSubmissionByChallenge } from '@/services/submissions'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Calendar, FileText, AlertCircle } from 'lucide-react'
import { SubmissionForm } from './components/submission-form'

export function ChallengeDetail() {
  const { id } = useParams({ from: '/_authenticated/public-challenges/$id/' })
  const navigate = useNavigate()
  const [showSubmitForm, setShowSubmitForm] = useState(false)

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => fetchChallenge(id),
  })

  const { data: existingSubmission } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => fetchSubmissionByChallenge(id),
  })

  if (isLoading) {
    return (
      <>
        <Header fixed>
          {/* <Search /> */}
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            {/* <ConfigDrawer /> */}
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='flex items-center justify-center h-96'>
            <p className='text-muted-foreground'>Loading challenge...</p>
          </div>
        </Main>
      </>
    )
  }

  if (!challenge) {
    return (
      <>
        <Header fixed>
          {/* <Search /> */}
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            {/* <ConfigDrawer /> */}
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <Card>
            <CardContent className='pt-6 text-center'>
              <AlertCircle className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>Challenge Not Found</h3>
              <p className='text-muted-foreground mb-4'>
                This challenge doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate({ to: '/public-challenges' })}>
                Back to Challenges
              </Button>
            </CardContent>
          </Card>
        </Main>
      </>
    )
  }

  const canSubmit = challenge.status === 'open'
  const hasSubmitted = !!existingSubmission

  return (
    <>
      <Header fixed>
        {/* <Search /> */}
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          {/* <ConfigDrawer /> */}
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <Button
          variant='ghost'
          className='mb-4'
          onClick={() => navigate({ to: '/public-challenges' })}
        >
          ← Back to Challenges
        </Button>

        <div className='space-y-6'>
          {/* Challenge Header */}
          <div>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h1 className='text-3xl font-bold tracking-tight mb-2'>
                  {challenge.title}
                </h1>
                <div className='flex items-center gap-3'>
                  <Badge variant={canSubmit ? 'default' : 'secondary'}>
                    {challenge.status}
                  </Badge>
                  {hasSubmitted && (
                    <Badge variant='outline'>
                      <FileText className='mr-1 h-3 w-3' />
                      Submitted
                    </Badge>
                  )}
                </div>
              </div>
              {canSubmit && (
                <Button
                  size='lg'
                  onClick={() => setShowSubmitForm(true)}
                  disabled={hasSubmitted && existingSubmission?.status === 'approved'}
                >
                  {hasSubmitted ? 'Edit Submission' : 'Submit Project'}
                </Button>
              )}
            </div>
          </div>

          {/* Submission Form Dialog */}
          {showSubmitForm && (
            <SubmissionForm
              challengeId={id}
              existingSubmission={existingSubmission}
              onClose={() => setShowSubmitForm(false)}
            />
          )}

          {/* Challenge Details Tabs */}
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='rules'>Rules</TabsTrigger>
              <TabsTrigger value='evaluation'>Evaluation</TabsTrigger>
              <TabsTrigger value='timeline'>Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground whitespace-pre-wrap'>
                    {challenge.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Trophy className='h-5 w-5' />
                    Prize Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold'>
                    {challenge.prize_pool || 'To be announced'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='rules'>
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Rules</CardTitle>
                  <CardDescription>
                    Please read carefully before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='prose prose-sm max-w-none'>
                    {challenge.rules ? (
                      <p className='whitespace-pre-wrap'>{challenge.rules}</p>
                    ) : (
                      <p className='text-muted-foreground'>No specific rules provided.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='evaluation'>
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                  <CardDescription>
                    How your submission will be judged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='prose prose-sm max-w-none'>
                    {challenge.evaluation_criteria ? (
                      <p className='whitespace-pre-wrap'>
                        {challenge.evaluation_criteria}
                      </p>
                    ) : (
                      <p className='text-muted-foreground'>
                        Evaluation criteria will be announced soon.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='timeline'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5' />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='prose prose-sm max-w-none'>
                    {challenge.timeline ? (
                      <p className='whitespace-pre-wrap'>{challenge.timeline}</p>
                    ) : (
                      <p className='text-muted-foreground'>
                        Timeline will be announced soon.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Sponsor Information */}
          {challenge.sponsor_link && (
            <Card>
              <CardHeader>
                <CardTitle>Sponsored By</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={challenge.sponsor_link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  {challenge.sponsor_link}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </Main>
    </>
  )
}
