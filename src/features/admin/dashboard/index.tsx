import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAdminStore } from '@/stores/admin-store'
import { adminLogout } from '@/services/admin-auth'
import { getAdminStats } from '@/services/admin'
import { toast } from 'sonner'
import { ChallengesManagement } from './challenges-management'
import { JudgesManagement } from './judges-management'
import { SubmissionsManagement } from './submissions-management'
import { WinnersManagement } from './winners-management'
import {
  Trophy,
  Users,
  FileText,
  Gavel,
  BarChart3,
} from 'lucide-react'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAdminStore()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const handleLogout = async () => {
    try {
      await adminLogout()
      logout()
      toast.success('Logged out successfully')
      navigate({ to: '/admin', replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <Trophy className='h-5 w-5' />
          <span className='font-semibold'>Admin Dashboard</span>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>{user?.email}</span>
            <Button variant='outline' size='sm' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Admin Dashboard
            </h1>
            <p className='text-muted-foreground'>
              Manage challenges, judges, and submissions
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
          <TabsList className='grid w-full grid-cols-5 lg:w-auto'>
            <TabsTrigger value='overview' className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4' />
              <span className='hidden sm:inline'>Overview</span>
            </TabsTrigger>
            <TabsTrigger value='challenges' className='flex items-center gap-2'>
              <Trophy className='h-4 w-4' />
              <span className='hidden sm:inline'>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value='judges' className='flex items-center gap-2'>
              <Gavel className='h-4 w-4' />
              <span className='hidden sm:inline'>Judges</span>
            </TabsTrigger>
            <TabsTrigger value='submissions' className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              <span className='hidden sm:inline'>Submissions</span>
            </TabsTrigger>
            <TabsTrigger value='winners' className='flex items-center gap-2'>
              <Trophy className='h-4 w-4' />
              <span className='hidden sm:inline'>Winners</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Challenges
                  </CardTitle>
                  <Trophy className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.totalChallenges || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Active and closed challenges
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Submissions
                  </CardTitle>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.totalSubmissions || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    All submissions received
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Judges
                  </CardTitle>
                  <Gavel className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.totalJudges || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Active judges in the system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Users
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.totalUsers || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Registered users
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    onClick={() => setActiveTab('challenges')}
                  >
                    <Trophy className='mr-2 h-4 w-4' />
                    Create New Challenge
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    onClick={() => setActiveTab('judges')}
                  >
                    <Gavel className='mr-2 h-4 w-4' />
                    Invite Judge
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    onClick={() => setActiveTab('submissions')}
                  >
                    <FileText className='mr-2 h-4 w-4' />
                    Review Submissions
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    onClick={() => setActiveTab('winners')}
                  >
                    <Trophy className='mr-2 h-4 w-4' />
                    Publish Winners
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    No recent activity to display
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='challenges'>
            <ChallengesManagement />
          </TabsContent>

          <TabsContent value='judges'>
            <JudgesManagement />
          </TabsContent>

          <TabsContent value='submissions'>
            <SubmissionsManagement />
          </TabsContent>

          <TabsContent value='winners'>
            <WinnersManagement />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
