import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { fetchMySubmissions } from '@/services/submissions'
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
import { FileText, ExternalLink, Github } from 'lucide-react'

export function MySubmissions() {
  const navigate = useNavigate()

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: fetchMySubmissions,
    staleTime: 1000 * 60 * 5,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'winner':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

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
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight mb-2'>
              My Submissions
            </h1>
            <p className='text-muted-foreground'>
              Track and manage your challenge submissions
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/public-challenges' })}>
            Browse Challenges
          </Button>
        </div>

        {isLoading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className='pt-6 text-center py-12'>
              <FileText className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No Submissions Yet</h3>
              <p className='text-muted-foreground mb-4'>
                You haven't submitted any projects yet. Start by browsing challenges!
              </p>
              <Button onClick={() => navigate({ to: '/public-challenges' })}>
                Browse Challenges
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='flex items-center gap-2'>
                        {submission.project_title}
                        <Badge variant={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className='mt-2'>
                        Submitted on{' '}
                        {new Date(submission.created_at).toLocaleDateString()}
                        {submission.updated_at &&
                          submission.updated_at !== submission.created_at && (
                            <span className='text-muted-foreground'>
                              {' '}
                              · Updated{' '}
                              {new Date(submission.updated_at).toLocaleDateString()}
                            </span>
                          )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='font-semibold mb-2'>Solution Description</h4>
                    <p className='text-sm text-muted-foreground line-clamp-3'>
                      {submission.solution_description}
                    </p>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {submission.github_url && (
                      <Button
                        variant='outline'
                        size='sm'
                        asChild
                      >
                        <a
                          href={submission.github_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Github className='mr-2 h-4 w-4' />
                          GitHub
                          <ExternalLink className='ml-2 h-3 w-3' />
                        </a>
                      </Button>
                    )}
                    {submission.demo_url && (
                      <Button
                        variant='outline'
                        size='sm'
                        asChild
                      >
                        <a
                          href={submission.demo_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <ExternalLink className='mr-2 h-4 w-4' />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className='pt-4 border-t flex justify-between items-center'>
                    <div className='text-sm text-muted-foreground'>
                      <span className='font-medium'>Contact:</span> {submission.email}
                      {submission.discord && ` · Discord: ${submission.discord}`}
                    </div>
                    {submission.status === 'submitted' && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          navigate({
                            to: '/public-challenges/$id',
                            params: { id: submission.challenge_id },
                          })
                        }
                      >
                        Edit Submission
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Main>
    </>
  )
}
