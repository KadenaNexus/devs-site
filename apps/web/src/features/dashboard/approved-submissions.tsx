import { useQuery } from '@tanstack/react-query'
import { fetchApprovedSubmissions } from '@/services/submissions'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ExternalLink, Github, Trophy } from 'lucide-react'

export function ApprovedSubmissions() {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['approved-submissions'],
    queryFn: fetchApprovedSubmissions,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <>
      <Header fixed>
        {/* <Search /> */}
        <div className='ms-auto flex items-center space-x-4'>
          {/* <ThemeSwitch />
          <ConfigDrawer /> */}
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight mb-2'>
            Approved Submissions
          </h1>
          <p className='text-muted-foreground'>
            Browse all approved project submissions from the community
          </p>
        </div>

        {isLoading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className='pt-6 text-center py-12'>
              <p className='text-muted-foreground'>
                No approved submissions yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {submissions.map((submission: any) => (
              <Card key={submission.id} className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex items-start gap-4 mb-2'>
                    <Avatar>
                      <AvatarImage src={submission.profile_pic} />
                      <AvatarFallback>
                        {submission.developer_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <CardTitle className='text-lg line-clamp-1'>
                        {submission.project_title}
                      </CardTitle>
                      <p className='text-sm text-muted-foreground'>
                        by {submission.developer_name}
                      </p>
                    </div>
                    {submission.status === 'winner' && (
                      <Trophy className='h-5 w-5 text-yellow-500' />
                    )}
                  </div>
                  {submission.challenges && (
                    <Badge variant='outline' className='w-fit'>
                      {submission.challenges.title}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className='space-y-4'>
                  <CardDescription className='line-clamp-4'>
                    {submission.solution_description}
                  </CardDescription>

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
                          Code
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
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  {submission.smart_contract_details && (
                    <div className='pt-3 border-t'>
                      <p className='text-xs font-semibold mb-1'>Smart Contract</p>
                      <p className='text-xs text-muted-foreground line-clamp-2'>
                        {submission.smart_contract_details}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Main>
    </>
  )
}
