import { useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ChallengesDialogs } from './components/challenges-dialogs'
import { ChallengesPrimaryButtons } from './components/challenges-primary-buttons'
import { ChallengesProvider } from './components/challenges-provider'
import { ChallengesTable } from './components/challenges-table'
import { fetchChallenges } from '@/services/challenges'

export function Challenges() {
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return (
    <ChallengesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Challenges</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of all available challenges!
            </p>
          </div>
          <ChallengesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='flex items-center justify-center h-96'>
              <p className='text-muted-foreground'>Loading challenges...</p>
            </div>
          ) : (
            <ChallengesTable data={challenges} />
          )}
        </div>
      </Main>

      <ChallengesDialogs />
    </ChallengesProvider>
  )
}