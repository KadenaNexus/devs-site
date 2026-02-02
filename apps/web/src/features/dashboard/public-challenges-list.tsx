import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { fetchChallenges } from '@/services/challenges'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trophy } from 'lucide-react'
import { useState } from 'react'

export function PublicChallengesList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
    staleTime: 1000 * 60 * 5,
  })

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      filter === '' ||
      challenge.title.toLowerCase().includes(filter.toLowerCase()) ||
      challenge.description.toLowerCase().includes(filter.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || challenge.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
          <h1 className='text-3xl font-bold tracking-tight mb-2'>
            Browse Challenges
          </h1>
          <p className='text-muted-foreground'>
            Explore all available challenges and submit your projects
          </p>
        </div>

        {/* Filters */}
        <div className='mb-6 flex gap-4'>
          <Input
            placeholder='Search challenges...'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='max-w-sm'
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='open'>Open</SelectItem>
              <SelectItem value='in_progress'>In Progress</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='closed'>Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading challenges...</p>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <Card>
            <CardContent className='pt-6 text-center'>
              <p className='text-muted-foreground'>
                No challenges found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className='hover:shadow-lg transition-shadow cursor-pointer'
                onClick={() =>
                  navigate({
                    to: '/public-challenges/$id',
                    params: { id: challenge.id },
                  })
                }
              >
                <CardHeader>
                  <div className='flex items-start justify-between mb-2'>
                    <Badge
                      variant={
                        challenge.status === 'open' ? 'default' : 'secondary'
                      }
                    >
                      {challenge.status}
                    </Badge>
                  </div>
                  <CardTitle className='line-clamp-2'>{challenge.title}</CardTitle>
                  <CardDescription className='line-clamp-3'>
                    {challenge.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Trophy className='h-4 w-4' />
                      <span>{challenge.prize_pool || 'TBA'}</span>
                    </div>
                  </div>
                  <Button
                    className='w-full'
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate({
                        to: '/public-challenges/$id',
                        params: { id: challenge.id },
                      })
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Main>
    </>
  )
}
