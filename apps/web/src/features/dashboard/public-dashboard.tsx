import { useQuery } from '@tanstack/react-query'
import { fetchChallenges } from '@/services/challenges'
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
import { Trophy, FileText, Eye } from 'lucide-react'

export function PublicDashboard() {
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['public-challenges'],
    queryFn: fetchChallenges,
    staleTime: 1000 * 60 * 5,
  })

  const { data: mySubmissions = [] } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: fetchMySubmissions,
    staleTime: 1000 * 60 * 5,
  })

  const openChallenges = challenges.filter((c) => c.status === 'open')
  const submittedChallenges = mySubmissions.length

  return (
    <>
      <Header fixed>
        {/* <Search /> */}
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Welcome to Challenge Platform
          </h1>
          <p className='text-muted-foreground mt-2'>
            Participate in challenges, submit your projects, and win prizes!
          </p>
        </div>

        {/* Stats Cards */}
        <div className='mb-6 grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Challenges
              </CardTitle>
              <Trophy className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{openChallenges.length}</div>
              <p className='text-xs text-muted-foreground'>
                Open for submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                My Submissions
              </CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{submittedChallenges}</div>
              <p className='text-xs text-muted-foreground'>
                Total submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Winners</CardTitle>
              <Trophy className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <a href='/winners' className='text-sm font-medium text-primary hover:underline'>
                View Winners
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className='mb-6 flex gap-4'>
          <a href='/public-challenges'>
            <Button>
              <Trophy className='mr-2 h-4 w-4' />
              Browse Challenges
            </Button>
          </a>
          <a href='/my-submissions'>
            <Button variant='outline'>
              <FileText className='mr-2 h-4 w-4' />
              My Submissions
            </Button>
          </a>
          <a href='/approved-submissions'>
            <Button variant='outline'>
              <Eye className='mr-2 h-4 w-4' />
              View All Submissions
            </Button>
          </a>
        </div>

        {/* Active Challenges List */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Active Challenges
            </h2>
            <a href='/public-challenges'>
              <Button variant='ghost'>
                View All
              </Button>
            </a>
          </div>

          {challengesLoading ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>Loading challenges...</p>
            </div>
          ) : openChallenges.length === 0 ? (
            <Card>
              <CardContent className='pt-6 text-center'>
                <p className='text-muted-foreground'>
                  No active challenges at the moment. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {openChallenges.slice(0, 6).map((challenge) => {
                const hasSubmitted = mySubmissions.some(
                  (s) => s.challenge_id === challenge.id
                )

                return (
                  <Card key={challenge.id} className='hover:shadow-lg transition-shadow'>
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <CardTitle className='text-lg'>
                          {challenge.title}
                        </CardTitle>
                        {hasSubmitted && (
                          <Badge variant='secondary'>Submitted</Badge>
                        )}
                      </div>
                      <CardDescription className='line-clamp-2'>
                        {challenge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <Trophy className='h-4 w-4' />
                          <span>{challenge.prize_pool || 'TBA'}</span>
                        </div>
                        <a href={`/public-challenges/${challenge.id}`}>
                          <Button size='sm'>
                            View Details
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
