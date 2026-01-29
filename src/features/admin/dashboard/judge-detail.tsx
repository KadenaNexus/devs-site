import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchJudgeById, fetchJudgeAssignedChallenges } from '@/services/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ArrowLeft, Calendar, Mail, User, Trophy } from 'lucide-react'

export function JudgeDetail() {
  const params = useParams({ strict: false })
  const judgeId = params.judgeId as string
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)

  const { data: judge, isLoading: judgeLoading } = useQuery({
    queryKey: ['judge', judgeId],
    queryFn: () => fetchJudgeById(judgeId),
  })

  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['judge-challenges', judgeId],
    queryFn: () => fetchJudgeAssignedChallenges(judgeId),
  })

  if (judgeLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-muted-foreground'>Loading judge details...</p>
      </div>
    )
  }

  if (!judge) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Judge not found</h2>
          <Link to='/admin/judges'>
            <Button variant='link'>Back to Judges</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      open: 'default',
      closed: 'secondary',
      draft: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Back Button */}
      <Link to='/admin/judges'>
        <Button variant='ghost' size='sm'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Judges
        </Button>
      </Link>

      {/* Judge Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Judge Details
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Name</p>
                <p className='font-medium'>{judge.name}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-medium'>{judge.email}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Joined</p>
                <p className='font-medium'>
                  {new Date(judge.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Trophy className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Assigned Challenges</p>
                <p className='font-medium'>{challenges.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          {challengesLoading ? (
            <div className='flex h-48 items-center justify-center'>
              <p className='text-muted-foreground'>Loading challenges...</p>
            </div>
          ) : challenges.length === 0 ? (
            <div className='flex h-48 items-center justify-center'>
              <p className='text-muted-foreground'>No challenges assigned yet</p>
            </div>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {challenges.map((challenge: any) => (
                <Card
                  key={challenge.id}
                  className='cursor-pointer hover:border-primary transition-colors'
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <CardTitle className='text-lg'>{challenge.title}</CardTitle>
                      {getStatusBadge(challenge.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
                      {challenge.description}
                    </p>
                    <div className='space-y-1 text-sm'>
                      {challenge.prize_pool && (
                        <p className='font-medium text-primary'>
                          Prize: {challenge.prize_pool}
                        </p>
                      )}
                      <p className='text-muted-foreground'>
                        Assigned: {new Date(challenge.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Challenge Detail Sheet */}
      <Sheet open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
        <SheetContent className='overflow-y-auto w-full sm:max-w-xl'>
          {selectedChallenge && (
            <>
              <SheetHeader>
                <div className='flex items-start justify-between'>
                  <SheetTitle className='pr-8'>{selectedChallenge.title}</SheetTitle>
                  {getStatusBadge(selectedChallenge.status)}
                </div>
                <SheetDescription>Challenge Details</SheetDescription>
              </SheetHeader>

              <div className='mt-6 space-y-6'>
                <div>
                  <h3 className='text-sm font-semibold mb-2'>Description</h3>
                  <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                    {selectedChallenge.description}
                  </p>
                </div>

                {selectedChallenge.prize_pool && (
                  <div>
                    <h3 className='text-sm font-semibold mb-2'>Prize Pool</h3>
                    <p className='text-sm text-muted-foreground'>
                      {selectedChallenge.prize_pool}
                    </p>
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h3 className='text-sm font-semibold mb-2'>Created</h3>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(selectedChallenge.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className='text-sm font-semibold mb-2'>Assigned</h3>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(selectedChallenge.assignedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className='pt-4'>
                  <Link to='/challenges/$id' params={{ id: selectedChallenge.id }}>
                    <Button className='w-full'>View Full Challenge</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
