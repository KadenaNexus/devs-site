import { useEffect, useState } from 'react'
import { getAssignedChallenges } from '@/services/judges'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type Challenge = {
  id: string
  title: string
  status: string
}

export function JudgeDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setIsLoading(true)
        const data = await getAssignedChallenges()
        console.log('📊 Loaded challenges:', data)
        setChallenges(data)
      } catch (error) {
        console.error('Failed to load assigned challenges:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChallenges()
  }, [])

  // Calculate statistics - All dynamic from server data
  const totalChallenges = challenges.length
  const activeChallenges = challenges.filter(
    (c) => c.status === 'active'
  ).length
  const completedChallenges = challenges.filter(
    (c) => c.status === 'completed'
  ).length
  const pendingChallenges = challenges.filter(
    (c) => c.status === 'pending'
  ).length

  console.log('📈 Dashboard Statistics:', {
    totalChallenges,
    activeChallenges,
    completedChallenges,
    pendingChallenges,
  })

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
          {/* <Search />
          <ThemeSwitch />
          <ConfigDrawer /> */}
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Judge Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button disabled>View Reports</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='challenges'>Challenges</TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Challenges
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                    <polyline points='9 22 9 12 15 12 15 22' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalChallenges}</div>
                  <p className='text-muted-foreground text-xs'>
                    Assigned to you
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Active</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <circle cx='12' cy='12' r='10' />
                    <path d='M12 6v6l4 2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{activeChallenges}</div>
                  <p className='text-muted-foreground text-xs'>In progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Completed
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {completedChallenges}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Finished scoring
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Pending</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <circle cx='12' cy='12' r='1' />
                    <circle cx='19' cy='12' r='1' />
                    <circle cx='5' cy='12' r='1' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{pendingChallenges}</div>
                  <p className='text-muted-foreground text-xs'>Not started</p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Challenge Status Overview</CardTitle>
                  <CardDescription>
                    Distribution of your assigned challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Active</span>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-32 overflow-hidden rounded-full bg-blue-200'>
                          <div
                            className='h-full bg-blue-600'
                            style={{
                              width: `${totalChallenges > 0 ? (activeChallenges / totalChallenges) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className='text-muted-foreground text-xs'>
                          {activeChallenges}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Completed</span>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-32 overflow-hidden rounded-full bg-green-200'>
                          <div
                            className='h-full bg-green-600'
                            style={{
                              width: `${totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className='text-muted-foreground text-xs'>
                          {completedChallenges}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Pending</span>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-32 overflow-hidden rounded-full bg-yellow-200'>
                          <div
                            className='h-full bg-yellow-600'
                            style={{
                              width: `${totalChallenges > 0 ? (pendingChallenges / totalChallenges) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className='text-muted-foreground text-xs'>
                          {pendingChallenges}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button className='w-full justify-start' variant='outline'>
                    📊 Review Submissions
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    📝 View Scores
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    📧 Download Report
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    ⚙️ Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='challenges' className='space-y-4'>
            <div>
              {isLoading ? (
                <Card>
                  <CardContent className='pt-6'>
                    <p className='text-muted-foreground text-center'>
                      Loading challenges...
                    </p>
                  </CardContent>
                </Card>
              ) : challenges.length === 0 ? (
                <Card>
                  <CardContent className='pt-6'>
                    <p className='text-muted-foreground text-center'>
                      No challenges assigned yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className='grid gap-4'>
                  {challenges.map((challenge) => (
                    <Card
                      key={challenge.id}
                      className='transition-shadow hover:shadow-md'
                    >
                      <CardHeader>
                        <div className='flex items-start justify-between'>
                          <div>
                            <CardTitle>{challenge.title}</CardTitle>
                            <CardDescription className='mt-1'>
                              Challenge ID: {challenge.id}
                            </CardDescription>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                              challenge.status === 'active'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : challenge.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {challenge.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button className='w-full'>View Submissions</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'judge-dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Submissions',
    href: '/challenges/submissions',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Reports',
    href: 'judge-dashboard/reports',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'judge-dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
