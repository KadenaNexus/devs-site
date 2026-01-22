import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { fetchChallenge, fetchSubmissions } from '@/services/challenges'
import { SubmissionsProvider } from './components/submissions-provider'
import { SubmissionsTable } from './components/submissions-table'

export function ChallengeSubmissions() {
  const { id } = useParams({ from: '/_authenticated/challenges/$id/submissions/' })

  const { data: challenge, isLoading: challengeLoading } = useQuery({
    queryKey: ['challenges', id],
    queryFn: () => fetchChallenge(id),
  })

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissions', id],
    queryFn: () => fetchSubmissions(id),
    staleTime: 1000 * 60 * 5,
  })

  const isLoading = challengeLoading || submissionsLoading

  return (
    <SubmissionsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {challenge?.title || 'Challenge'} - Submissions
            </h2>
            <p className='text-muted-foreground'>
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='flex items-center justify-center h-96'>
              <p className='text-muted-foreground'>Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className='flex items-center justify-center h-96'>
              <p className='text-muted-foreground'>No submissions yet</p>
            </div>
          ) : (
            <SubmissionsTable data={submissions} />
          )}
        </div>
      </Main>
    </SubmissionsProvider>
  )
}