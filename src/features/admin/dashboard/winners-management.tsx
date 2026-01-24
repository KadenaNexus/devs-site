import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchChallenges, fetchSubmissions } from '@/services/challenges'
import { publishWinners, fetchWinners } from '@/services/admin'
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
import { Trophy, Plus, X } from 'lucide-react'

interface WinnerForm {
  submissionId: string
  rank: number
  prizeAmount: string
}

export function WinnersManagement() {
  const queryClient = useQueryClient()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [winners, setWinners] = useState<WinnerForm[]>([
    { submissionId: '', rank: 1, prizeAmount: '' },
  ])

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions', selectedChallengeId],
    queryFn: () => fetchSubmissions(selectedChallengeId),
    enabled: !!selectedChallengeId,
  })

  const { data: existingWinners = [] } = useQuery({
    queryKey: ['winners', selectedChallengeId],
    queryFn: () => fetchWinners(selectedChallengeId),
    enabled: !!selectedChallengeId,
  })

  const publishMutation = useMutation({
    mutationFn: (data: { challengeId: string; winners: WinnerForm[] }) =>
      publishWinners(data.challengeId, data.winners),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winners'] })
      toast.success('Winners published successfully')
      setIsDialogOpen(false)
      setWinners([{ submissionId: '', rank: 1, prizeAmount: '' }])
    },
    onError: (error) => {
      toast.error('Failed to publish winners')
      console.error(error)
    },
  })

  const handleAddWinner = () => {
    setWinners([
      ...winners,
      { submissionId: '', rank: winners.length + 1, prizeAmount: '' },
    ])
  }

  const handleRemoveWinner = (index: number) => {
    const updated = winners.filter((_, i) => i !== index)
    // Update ranks
    updated.forEach((w, i) => (w.rank = i + 1))
    setWinners(updated)
  }

  const handleWinnerChange = (
    index: number,
    field: keyof WinnerForm,
    value: string | number
  ) => {
    const updated = [...winners]
    updated[index] = { ...updated[index], [field]: value }
    setWinners(updated)
  }

  const handlePublish = () => {
    if (!selectedChallengeId) {
      toast.error('Please select a challenge')
      return
    }

    const validWinners = winners.filter((w) => w.submissionId)
    if (validWinners.length === 0) {
      toast.error('Please select at least one winner')
      return
    }

    publishMutation.mutate({
      challengeId: selectedChallengeId,
      winners: validWinners,
    })
  }

  const getRankBadge = (rank: number) => {
    const colors: Record<number, string> = {
      1: 'bg-yellow-500',
      2: 'bg-gray-400',
      3: 'bg-orange-600',
    }
    return (
      <Badge
        className={`${colors[rank] || 'bg-blue-500'} text-white`}
      >
        #{rank}
      </Badge>
    )
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
              <option value=''>Select a challenge</option>
              {challenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.title}
                </option>
              ))}
            </select>
            <Button
              onClick={() => setIsDialogOpen(true)}
              disabled={!selectedChallengeId}
            >
              <Trophy className='mr-2 h-4 w-4' />
              Publish Winners
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedChallengeId ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>
              Select a challenge to view/publish winners
            </p>
          </div>
        ) : existingWinners.length === 0 ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>No winners published yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Prize</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingWinners.map((winner) => {
                const submission = submissions.find(
                  (s) => s.id === winner.submission_id
                )
                return (
                  <TableRow key={winner.id}>
                    <TableCell>{getRankBadge(winner.rank)}</TableCell>
                    <TableCell className='font-medium'>
                      {submission?.project_title || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {submission?.developer_name || 'Unknown'}
                    </TableCell>
                    <TableCell>{winner.prize_amount || 'N/A'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Publish Winners</DialogTitle>
              <DialogDescription>
                Select submissions and assign ranks to publish winners
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className='flex gap-2 items-end p-4 border rounded-lg'
                >
                  <div className='flex-1'>
                    <Label>Rank #{winner.rank}</Label>
                    <select
                      className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1'
                      value={winner.submissionId}
                      onChange={(e) =>
                        handleWinnerChange(index, 'submissionId', e.target.value)
                      }
                    >
                      <option value=''>Select submission</option>
                      {submissions
                        .filter(
                          (s) =>
                            s.status === 'approved' &&
                            !winners.find((w, i) => i !== index && w.submissionId === s.id)
                        )
                        .map((submission) => (
                          <option key={submission.id} value={submission.id}>
                            {submission.project_title} - {submission.developer_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className='w-32'>
                    <Label>Prize Amount</Label>
                    <Input
                      placeholder='$1000'
                      value={winner.prizeAmount}
                      onChange={(e) =>
                        handleWinnerChange(index, 'prizeAmount', e.target.value)
                      }
                      className='mt-1'
                    />
                  </div>
                  {winners.length > 1 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleRemoveWinner(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant='outline'
                onClick={handleAddWinner}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Winner
              </Button>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={
                  winners.filter((w) => w.submissionId).length === 0 ||
                  publishMutation.isPending
                }
              >
                Publish Winners
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
