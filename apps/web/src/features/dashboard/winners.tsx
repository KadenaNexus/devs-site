import { useQuery } from '@tanstack/react-query'
import { fetchWinners } from '@/services/submissions'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ExternalLink, Github, Trophy, Award } from 'lucide-react'

export function Winners() {
  const { data: winners = [], isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: fetchWinners,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          {/* <ConfigDrawer /> */}
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-8 text-center'>
          <Trophy className='mx-auto h-16 w-16 text-yellow-500 mb-4' />
          <h1 className='text-4xl font-bold tracking-tight mb-2'>
            Challenge Winners
          </h1>
          <p className='text-muted-foreground text-lg'>
            Celebrating the best projects from our community
          </p>
        </div>

        {isLoading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading winners...</p>
          </div>
        ) : winners.length === 0 ? (
          <Card>
            <CardContent className='pt-6 text-center py-12'>
              <Award className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No Winners Yet</h3>
              <p className='text-muted-foreground'>
                Winners will be announced after challenges are completed!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-8'>
            {winners.map((winner: any) => (
              <Card
                key={winner.id}
                className='overflow-hidden border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50/50 to-white dark:from-yellow-950/10 dark:to-background'
              >
                <div className='absolute top-4 right-4'>
                  <Trophy className='h-8 w-8 text-yellow-500' />
                </div>
                <CardHeader className='pb-4'>
                  <div className='flex items-start gap-6'>
                    <div className='relative'>
                      <Avatar className='h-20 w-20 border-4 border-yellow-500/50'>
                        <AvatarImage src={winner.profile_pic} />
                        <AvatarFallback className='text-2xl'>
                          {winner.developer_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm'>
                        #{winner.rank || 1}
                      </div>
                    </div>
                    <div className='flex-1'>
                      <Badge className='mb-2 bg-yellow-500 hover:bg-yellow-600'>
                        🏆 {winner.rank === 1 ? 'First Place' : winner.rank === 2 ? 'Second Place' : winner.rank === 3 ? 'Third Place' : `Rank ${winner.rank}`}
                      </Badge>
                      <CardTitle className='text-2xl mb-1'>
                        {winner.project_title}
                      </CardTitle>
                      <p className='text-lg text-muted-foreground'>
                        by <span className='font-semibold'>{winner.developer_name}</span>
                      </p>
                      {winner.challenges && (
                        <div className='mt-3 flex items-center gap-4 text-sm'>
                          <Badge variant='outline'>
                            {winner.challenges.title}
                          </Badge>
                          {winner.prize_amount && (
                            <div className='flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-semibold'>
                              <Trophy className='h-4 w-4' />
                              ${parseFloat(winner.prize_amount).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <h4 className='font-semibold mb-2 flex items-center gap-2'>
                      <Award className='h-4 w-4' />
                      Project Overview
                    </h4>
                    <p className='text-muted-foreground'>
                      {winner.solution_description}
                    </p>
                  </div>

                  {winner.problem_statement && (
                    <div>
                      <h4 className='font-semibold mb-2'>Problem Statement</h4>
                      <p className='text-sm text-muted-foreground'>
                        {winner.problem_statement}
                      </p>
                    </div>
                  )}

                  {winner.smart_contract_details && (
                    <div>
                      <h4 className='font-semibold mb-2'>Smart Contract Details</h4>
                      <p className='text-sm text-muted-foreground font-mono bg-muted p-3 rounded-md'>
                        {winner.smart_contract_details}
                      </p>
                    </div>
                  )}

                  <div className='flex flex-wrap gap-3 pt-4'>
                    {winner.github_url && (
                      <Button
                        variant='default'
                        asChild
                      >
                        <a
                          href={winner.github_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Github className='mr-2 h-4 w-4' />
                          View Source Code
                          <ExternalLink className='ml-2 h-3 w-3' />
                        </a>
                      </Button>
                    )}
                    {winner.demo_url && (
                      <Button
                        variant='outline'
                        asChild
                      >
                        <a
                          href={winner.demo_url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <ExternalLink className='mr-2 h-4 w-4' />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className='pt-4 border-t flex justify-between items-center text-sm text-muted-foreground'>
                    <div>
                      <span className='font-medium'>Contact:</span> {winner.email}
                      {winner.discord && (
                        <span className='ml-3'>
                          <span className='font-medium'>Discord:</span> {winner.discord}
                        </span>
                      )}
                      {winner.telegram && (
                        <span className='ml-3'>
                          <span className='font-medium'>Telegram:</span> {winner.telegram}
                        </span>
                      )}
                    </div>
                    <span>
                      Won on {new Date(winner.announced_at || winner.created_at).toLocaleDateString()}
                    </span>
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
