import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createChallenge,
  updateChallenge,
  deleteChallenge,
  toggleChallengeStatus,
} from '@/services/admin'
import { fetchChallenges } from '@/services/challenges'
import { Plus, Edit, Trash2, Lock, Unlock, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminStore } from '@/stores/admin-store'
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { type Challenge } from '@/features/challenges/data/schema'

export function ChallengesManagement() {
  const queryClient = useQueryClient()
  const { user } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  )
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rules: '',
    timeline: '',
    prize_pool: '',
    evaluation_criteria: '',
    sponsor_link: '',
    status: 'draft',
  })

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  // Pagination logic
  const totalPages = Math.ceil(challenges.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedChallenges = challenges.slice(startIndex, endIndex)

  const createMutation = useMutation({
    mutationFn: (data: any) => createChallenge(data), // Remove created_by, it's handled in the service
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Challenge created successfully')
      handleCloseDialog()
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to create challenge'
      toast.error(errorMessage)
      console.error(error)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateChallenge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Challenge updated successfully')
      handleCloseDialog()
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to update challenge'
      toast.error(errorMessage)
      console.error(error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Challenge deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete challenge')
      console.error(error)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'open' | 'closed' }) =>
      toggleChallengeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Challenge status updated')
    },
    onError: (error) => {
      toast.error('Failed to update challenge status')
      console.error(error)
    },
  })

  const handleOpenDialog = (challenge?: Challenge) => {
    if (challenge) {
      setCurrentChallenge(challenge)
      setFormData({
        title: challenge.title,
        description: challenge.description,
        rules: challenge.rules || '',
        timeline: challenge.timeline || '',
        prize_pool: challenge.prize_pool || '',
        evaluation_criteria: challenge.evaluation_criteria || '',
        sponsor_link: challenge.sponsor_link || '',
        status: challenge.status,
      })
    } else {
      setCurrentChallenge(null)
      setFormData({
        title: '',
        description: '',
        rules: '',
        timeline: '',
        prize_pool: '',
        evaluation_criteria: '',
        sponsor_link: '',
        status: 'draft',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setCurrentChallenge(null)
    setFormData({
      title: '',
      description: '',
      rules: '',
      timeline: '',
      prize_pool: '',
      evaluation_criteria: '',
      sponsor_link: '',
      status: 'draft',
    })
  }

  const handleSubmit = () => {
    if (currentChallenge) {
      updateMutation.mutate({ id: currentChallenge.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
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
              <CardTitle>Challenges Management</CardTitle>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className='mr-2 h-4 w-4' />
                Create Challenge
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex h-48 items-center justify-center'>
                <p className='text-muted-foreground'>Loading challenges...</p>
              </div>
            ) : challenges.length === 0 ? (
              <div className='flex h-48 items-center justify-center'>
                <p className='text-muted-foreground'>No challenges yet</p>
              </div>
            ) : (
              <>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prize Pool</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedChallenges.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell className='font-medium'>
                            {challenge.title}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(challenge.status)}
                          </TableCell>
                          <TableCell>{challenge.prize_pool || 'N/A'}</TableCell>
                          <TableCell>
                            {new Date(
                              challenge.created_at
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleOpenDialog(challenge)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => {
                                  const newStatus =
                                    challenge.status === 'open'
                                      ? 'closed'
                                      : 'open'
                                  toggleStatusMutation.mutate({
                                    id: challenge.id,
                                    status: newStatus,
                                  })
                                }}
                              >
                                {challenge.status === 'open' ? (
                                  <Lock className='h-4 w-4' />
                                ) : (
                                  <Unlock className='h-4 w-4' />
                                )}
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => {
                                  if (
                                    confirm(
                                      'Are you sure you want to delete this challenge?'
                                    )
                                  ) {
                                    deleteMutation.mutate(challenge.id)
                                  }
                                }}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className='flex items-center justify-between px-2 py-4'>
                  <div className='text-muted-foreground text-sm'>
                    Showing {startIndex + 1} to{' '}
                    {Math.min(endIndex, challenges.length)} of{' '}
                    {challenges.length} challenges
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className='flex items-center gap-1'>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
                            size='sm'
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>
                    {currentChallenge ? 'Edit Challenge' : 'Create Challenge'}
                  </DialogTitle>
                  <DialogDescription>
                    {currentChallenge
                      ? 'Update challenge details'
                      : 'Create a new challenge for participants'}
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='title'>Title *</Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder='Challenge title'
                    />
                  </div>
                  <div>
                    <Label htmlFor='description'>Description *</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder='Describe the challenge'
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor='rules'>Rules</Label>
                    <Textarea
                      id='rules'
                      value={formData.rules}
                      onChange={(e) =>
                        setFormData({ ...formData, rules: e.target.value })
                      }
                      placeholder='Challenge rules'
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor='timeline'>Timeline</Label>
                    <Input
                      id='timeline'
                      value={formData.timeline}
                      onChange={(e) =>
                        setFormData({ ...formData, timeline: e.target.value })
                      }
                      placeholder='e.g., 2 weeks, Jan 1 - Jan 15'
                    />
                  </div>
                  <div>
                    <Label htmlFor='prize_pool'>Prize Pool</Label>
                    <Input
                      id='prize_pool'
                      value={formData.prize_pool}
                      onChange={(e) =>
                        setFormData({ ...formData, prize_pool: e.target.value })
                      }
                      placeholder='e.g., $10,000'
                    />
                  </div>
                  <div>
                    <Label htmlFor='evaluation_criteria'>
                      Evaluation Criteria
                    </Label>
                    <Textarea
                      id='evaluation_criteria'
                      value={formData.evaluation_criteria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          evaluation_criteria: e.target.value,
                        })
                      }
                      placeholder='How will submissions be evaluated?'
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor='sponsor_link'>Sponsor Link</Label>
                    <Input
                      id='sponsor_link'
                      value={formData.sponsor_link}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sponsor_link: e.target.value,
                        })
                      }
                      placeholder='https://sponsor.com'
                    />
                  </div>
                  <div>
                    <Label htmlFor='status'>Status</Label>
                    <select
                      id='status'
                      className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value='draft'>Draft</option>
                      <option value='open'>Open</option>
                      <option value='closed'>Closed</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant='outline' onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !formData.title ||
                      !formData.description ||
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
                  >
                    {currentChallenge ? 'Update' : 'Create'}
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
