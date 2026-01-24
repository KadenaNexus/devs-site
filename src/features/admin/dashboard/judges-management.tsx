import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchJudges, inviteJudge, assignJudgeToChallenge } from '@/services/admin'
import { fetchChallenges } from '@/services/challenges'
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
import { toast } from 'sonner'
import { Plus, UserPlus } from 'lucide-react'

export function JudgesManagement() {
  const queryClient = useQueryClient()
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedJudgeId, setSelectedJudgeId] = useState('')
  const [formData, setFormData] = useState({ email: '', name: '' })
  const [selectedChallengeId, setSelectedChallengeId] = useState('')

  const { data: judges = [], isLoading } = useQuery({
    queryKey: ['judges'],
    queryFn: fetchJudges,
  })

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; name: string }) =>
      inviteJudge(data.email, data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['judges'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Judge invited successfully')
      setIsInviteDialogOpen(false)
      setFormData({ email: '', name: '' })
    },
    onError: (error) => {
      toast.error('Failed to invite judge')
      console.error(error)
    },
  })

  const assignMutation = useMutation({
    mutationFn: ({ judgeId, challengeId }: { judgeId: string; challengeId: string }) =>
      assignJudgeToChallenge(judgeId, challengeId),
    onSuccess: () => {
      toast.success('Judge assigned to challenge')
      setIsAssignDialogOpen(false)
      setSelectedJudgeId('')
      setSelectedChallengeId('')
    },
    onError: (error) => {
      toast.error('Failed to assign judge')
      console.error(error)
    },
  })

  const handleInviteJudge = () => {
    inviteMutation.mutate(formData)
  }

  const handleAssignJudge = () => {
    if (selectedJudgeId && selectedChallengeId) {
      assignMutation.mutate({
        judgeId: selectedJudgeId,
        challengeId: selectedChallengeId,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Judges Management</CardTitle>
          <div className='flex gap-2'>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Invite Judge
            </Button>
            <Button variant='outline' onClick={() => setIsAssignDialogOpen(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              Assign to Challenge
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>Loading judges...</p>
          </div>
        ) : judges.length === 0 ? (
          <div className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>No judges yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {judges.map((judge) => (
                <TableRow key={judge.id}>
                  <TableCell className='font-medium'>{judge.name}</TableCell>
                  <TableCell>{judge.email}</TableCell>
                  <TableCell>
                    {new Date(judge.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Judge</DialogTitle>
              <DialogDescription>
                Send an invitation to a new judge
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='name'>Name *</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='Judge name'
                />
              </div>
              <div>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='judge@example.com'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsInviteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInviteJudge}
                disabled={!formData.email || !formData.name || inviteMutation.isPending}
              >
                Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Judge to Challenge</DialogTitle>
              <DialogDescription>
                Select a judge and challenge to assign
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='judge'>Judge *</Label>
                <select
                  id='judge'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={selectedJudgeId}
                  onChange={(e) => setSelectedJudgeId(e.target.value)}
                >
                  <option value=''>Select a judge</option>
                  {judges.map((judge) => (
                    <option key={judge.id} value={judge.id}>
                      {judge.name} ({judge.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor='challenge'>Challenge *</Label>
                <select
                  id='challenge'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
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
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignJudge}
                disabled={
                  !selectedJudgeId ||
                  !selectedChallengeId ||
                  assignMutation.isPending
                }
              >
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
