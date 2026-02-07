import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchJudges,
  inviteJudge,
  assignJudgeToChallenge,
} from '@/services/admin'
import { fetchChallenges } from '@/services/challenges'
import { Plus, Trophy, UserPlus } from 'lucide-react'
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
import { AdminJudgesTable } from './components/admin-judges-table'

export function JudgesManagement() {
  const queryClient = useQueryClient()
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedJudgeId, setSelectedJudgeId] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  })
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
    mutationFn: (data: { email: string; name: string; password: string }) =>
      inviteJudge(data.email, data.name, data.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['judges'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Judge invited successfully')
      setIsInviteDialogOpen(false)
      setFormData({ email: '', name: '', password: '' })
    },
    onError: (error) => {
      toast.error('Failed to invite judge')
      console.error(error)
    },
  })

  const assignMutation = useMutation({
    mutationFn: ({
      judgeId,
      challengeId,
    }: {
      judgeId: string
      challengeId: string
    }) => assignJudgeToChallenge(judgeId, challengeId),
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
              <CardTitle>Judges Management</CardTitle>
              <div className='flex gap-2'>
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <Plus className='mr-2 h-4 w-4' />
                  Invite Judge
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsAssignDialogOpen(true)}
                >
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
              <AdminJudgesTable data={judges} />
            )}

            <Dialog
              open={isInviteDialogOpen}
              onOpenChange={setIsInviteDialogOpen}
            >
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
                  <div>
                    <Label htmlFor='password'>Password *</Label>
                    <Input
                      id='password'
                      type='password'
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder='Secure password'
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
                    disabled={
                      !formData.email ||
                      !formData.name ||
                      !formData.password ||
                      inviteMutation.isPending
                    }
                  >
                    Invite
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isAssignDialogOpen}
              onOpenChange={setIsAssignDialogOpen}
            >
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
                      className='border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
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
                      className='border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
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
      </Main>
    </>
  )
}
