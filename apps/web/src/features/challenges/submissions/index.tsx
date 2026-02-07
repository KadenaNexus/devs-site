import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import { fetchChallenge, fetchSubmissions } from '@/services/challenges'
import { isJudgeAssignedToChallenge, getUserRole } from '@/services/authorization'
import { supabase } from '@/services/supabase'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SubmissionsDialogs } from './components/submissions-dialogs'
import { SubmissionsProvider } from './components/submissions-provider'
import { SubmissionsTable } from './components/submissions-table'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ChallengeSubmissions() {
  const navigate = useNavigate()
  const { id } = useParams({
    from: '/_authenticated/challenges/$id/submissions/',
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        
        if (user?.id) {
          setUserId(user.id)
        }

        const role = await getUserRole()

        // Check authorization based on role
        if (role === 'admin') {
          setIsAuthorized(true)
        } else if (role === 'judge') {
          const assigned = await isJudgeAssignedToChallenge(id)
          if (!assigned) {
            setAuthError('You are not assigned to this challenge')
            setIsAuthorized(false)
            // Redirect after a short delay
            setTimeout(() => {
              navigate({ to: '/judge-dashboard' })
            }, 2000)
          } else {
            setIsAuthorized(true)
          }
        } else if (role === 'public') {
          setAuthError('You do not have permission to view challenge submissions')
          setIsAuthorized(false)
          setTimeout(() => {
            navigate({ to: '/dashboard' })
          }, 2000)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error('Authorization check failed:', error)
        setIsAuthorized(false)
      }
    }

    checkAuthorization()
  }, [id, navigate])

  const { data: challenge, isLoading: challengeLoading } = useQuery({
    queryKey: ['challenges', id],
    queryFn: () => fetchChallenge(id),
    enabled: isAuthorized === true,
  })

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissions', id],
    queryFn: () => fetchSubmissions(id),
    staleTime: 1000 * 60 * 5,
    enabled: isAuthorized === true,
  })

  const isLoading = challengeLoading || submissionsLoading

  // Show authorization check loading
  if (isAuthorized === null) {
    return (
      <SubmissionsProvider userId={userId}>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            {/* <ConfigDrawer /> */}
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='flex h-96 items-center justify-center'>
            <p className='text-muted-foreground'>Checking authorization...</p>
          </div>
        </Main>
      </SubmissionsProvider>
    )
  }

  // Show error if not authorized
  if (isAuthorized === false) {
    return (
      <SubmissionsProvider userId={userId}>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            {/* <ConfigDrawer /> */}
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <Alert variant='destructive' className='max-w-2xl mx-auto mt-8'>
            <AlertDescription>
              {authError || 'You do not have permission to access this challenge.'}
            </AlertDescription>
          </Alert>
        </Main>
      </SubmissionsProvider>
    )
  }

  return (
    <SubmissionsProvider userId={userId}>
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
            <h2 className='text-2xl font-bold tracking-tight'>
              {challenge?.title || 'Challenge'} - Submissions
            </h2>
            <p className='text-muted-foreground'>
              {submissions.length} submission
              {submissions.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='flex h-96 items-center justify-center'>
              <p className='text-muted-foreground'>Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className='flex h-96 items-center justify-center'>
              <p className='text-muted-foreground'>No submissions yet</p>
            </div>
          ) : (
            <SubmissionsTable data={submissions} />
          )}
        </div>
      </Main>

      <SubmissionsDialogs />
    </SubmissionsProvider>
  )
}
