import { useQuery } from '@tanstack/react-query'
import { fetchChallenges } from '@/services/challenges'
import { getAssignedChallenges } from '@/services/judges'
import { supabase } from '@/services/supabase'
import { useAdminStore } from '@/stores/admin-store'
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

export function Challenges() {
  const { isAuthenticated: isAdmin } = useAdminStore()

  // Get role from Supabase
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return (user?.user_metadata?.role as string | undefined)?.toLowerCase() || null
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges', userRole, isAdmin],
    queryFn: async () => {
      if (isAdmin || userRole === 'admin') {
        return fetchChallenges()
      }
      if (userRole === 'judge') {
        return getAssignedChallenges()
      }
      return fetchChallenges()
    },
    enabled: (userRole !== undefined && userRole !== null) || isAdmin,
    staleTime: 5 * 60 * 1000,
  })

  const heading =
    isAdmin || userRole === 'admin'
      ? 'Here’s a list of all available challenges!'
      : 'Here are the challenges assigned to you.'

  return (
    <ChallengesProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          {/* <ConfigDrawer /> */}
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Challenges</h2>
            <p className='text-muted-foreground'>{heading}</p>
          </div>
          <ChallengesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading || roleLoading ? (
            <div className='flex h-96 items-center justify-center'>
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