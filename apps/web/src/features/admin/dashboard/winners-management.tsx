import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchWinners,
  announceWinner,
  fetchSubmissionsWithDetails,
} from '@/services/admin'
import { fetchChallenges } from '@/services/challenges'
import { Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AdminWinnersTable } from './components/admin-winners-table'
export function WinnersManagement() {
  const queryClient = useQueryClient()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    challengeId: '',
    submissionId: '',
    rank: 1,
    prizeAmount: '',
  })

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const { data: winners = [], isLoading } = useQuery({
    queryKey: ['winners', selectedChallengeId],
    queryFn: () =>
      selectedChallengeId === 'all'
        ? fetchWinners()
        : fetchWinners(selectedChallengeId),
  })

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions-for-winners', formData.challengeId],
    queryFn: () =>
      formData.challengeId
        ? fetchSubmissionsWithDetails(formData.challengeId)
        : Promise.resolve([]),
    enabled: !!formData.challengeId,
  })

  const announceMutation = useMutation({
    mutationFn: (data: {
      challengeId: string
      submissionId: string
      rank: number
      prizeAmount?: number
    }) => announceWinner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winners'] })
      toast.success('Winner announced successfully')
      setIsDialogOpen(false)
      setFormData({
        challengeId: '',
        submissionId: '',
        rank: 1,
        prizeAmount: '',
      })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to announce winner')
      console.error(error)
    },
  })

  const handleAnnounceWinner = () => {
    if (!formData.challengeId || !formData.submissionId || !formData.rank) {
      toast.error('Please fill in all required fields')
      return
    }

    announceMutation.mutate({
      challengeId: formData.challengeId,
      submissionId: formData.submissionId,
      rank: formData.rank,
      prizeAmount: formData.prizeAmount
        ? parseFloat(formData.prizeAmount)
        : undefined,
    })
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <Trophy className='h-5 w-5' />
          <span className='font-semibold'>Admin</span>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Winners Management</CardTitle>
              <div className='flex items-center gap-2'>
                <select
                  className='border-input bg-background flex h-10 w-64 rounded-md border px-3 py-2 text-sm'
                  value={selectedChallengeId}
                  onChange={(e) => setSelectedChallengeId(e.target.value)}
                >
                  <option value='all'>All Winners</option>
                  {challenges.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.title}
                    </option>
                  ))}
                </select>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Trophy className='mr-2 h-4 w-4' />
                  Announce Winner
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex h-48 items-center justify-center'>
                <p className='text-muted-foreground'>Loading winners...</p>
              </div>
            ) : winners.length === 0 ? (
              <div className='flex h-48 items-center justify-center'>
                <p className='text-muted-foreground'>
                  No winners announced yet
                </p>
              </div>
            ) : (
              <AdminWinnersTable data={winners} />
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Announce Winner</DialogTitle>
                  <DialogDescription>
                    Select a challenge, submission, and rank to announce a
                    winner
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='challenge'>Challenge *</Label>
                    <select
                      id='challenge'
                      className='border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
                      value={formData.challengeId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          challengeId: e.target.value,
                          submissionId: '',
                        })
                      }
                    >
                      <option value=''>Select a challenge</option>
                      {challenges.map((challenge) => (
                        <option key={challenge.id} value={challenge.id}>
                          {challenge.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.challengeId && (
                    <div>
                      <Label htmlFor='submission'>Submission *</Label>
                      <select
                        id='submission'
                        className='border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
                        value={formData.submissionId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            submissionId: e.target.value,
                          })
                        }
                      >
                        <option value=''>Select a submission</option>
                        {submissions.map((submission: any) => (
                          <option key={submission.id} value={submission.id}>
                            {submission.project_title} -{' '}
                            {submission.developer_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor='rank'>Rank *</Label>
                    <Input
                      id='rank'
                      type='number'
                      min='1'
                      value={formData.rank}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rank: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder='1, 2, 3...'
                    />
                  </div>

                  <div>
                    <Label htmlFor='prize'>Prize Amount (Optional)</Label>
                    <Input
                      id='prize'
                      type='number'
                      min='0'
                      step='0.01'
                      value={formData.prizeAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prizeAmount: e.target.value,
                        })
                      }
                      placeholder='e.g., 10000'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAnnounceWinner}
                    disabled={announceMutation.isPending}
                  >
                    Announce Winner
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
