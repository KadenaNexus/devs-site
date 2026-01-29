import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchChallenges } from '@/services/challenges'
import { fetchWinners, announceWinner, deleteWinner, fetchSubmissionsWithDetails } from '@/services/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Trophy, Trash2 } from 'lucide-react'

export function WinnersManagement() {
  const queryClient = useQueryClient()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
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
    queryFn: () => formData.challengeId ? fetchSubmissionsWithDetails(formData.challengeId) : Promise.resolve([]),
    enabled: !!formData.challengeId,
  })

  // Pagination logic
  const totalPages = Math.ceil(winners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWinners = winners.slice(startIndex, endIndex)

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

  const deleteMutation = useMutation({
    mutationFn: (winnerId: string) => deleteWinner(winnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winners'] })
      toast.success('Winner removed successfully')
    },
    onError: (error) => {
      toast.error('Failed to remove winner')
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
      prizeAmount: formData.prizeAmount ? parseFloat(formData.prizeAmount) : undefined,
    })
  }

  const getRankBadge = (rank: number) => {
    const config: Record<number, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      1: { label: '🥇 1st Place', variant: 'default' },
      2: { label: '🥈 2nd Place', variant: 'secondary' },
      3: { label: '🥉 3rd Place', variant: 'outline' },
    }
    
    if (rank <= 3) {
      return <Badge variant={config[rank].variant}>{config[rank].label}</Badge>
    }
    
    return <Badge variant="outline">{rank}th Place</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Winners Management</CardTitle>
          <div className='flex gap-2 items-center'>
            <select
              className='flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm'
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
            <p className='text-muted-foreground'>No winners announced yet</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Challenge Name</TableHead>
                  <TableHead>Developer Name</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWinners.map((winner: any) => (
                  <TableRow key={winner.id}>
                    <TableCell className='font-medium'>
                      {winner.challenge_name}
                    </TableCell>
                    <TableCell>{winner.developer_name}</TableCell>
                    <TableCell>{getRankBadge(winner.rank)}</TableCell>
                    <TableCell>
                      {winner.prize_amount 
                        ? `$${parseFloat(winner.prize_amount).toLocaleString()}` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => deleteMutation.mutate(winner.id)}
                        title='Remove Winner'
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className='flex items-center justify-between px-2 py-4'>
              <div className='text-sm text-muted-foreground'>
                Showing {startIndex + 1} to {Math.min(endIndex, winners.length)} of {winners.length} winners
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Announce Winner</DialogTitle>
              <DialogDescription>
                Select a challenge, submission, and rank to announce a winner
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='challenge'>Challenge *</Label>
                <select
                  id='challenge'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={formData.challengeId}
                  onChange={(e) => setFormData({ ...formData, challengeId: e.target.value, submissionId: '' })}
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
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                    value={formData.submissionId}
                    onChange={(e) => setFormData({ ...formData, submissionId: e.target.value })}
                  >
                    <option value=''>Select a submission</option>
                    {submissions.map((submission: any) => (
                      <option key={submission.id} value={submission.id}>
                        {submission.project_title} - {submission.developer_name}
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
                  onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 1 })}
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
                  onChange={(e) => setFormData({ ...formData, prizeAmount: e.target.value })}
                  placeholder='e.g., 10000'
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
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
  )
}
