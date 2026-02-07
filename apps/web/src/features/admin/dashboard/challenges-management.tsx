import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createChallenge, updateChallenge, uploadChallengeImage } from '@/services/admin'
import { fetchChallenges } from '@/services/challenges'
import { Plus, Trophy, Upload, X } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { type Challenge, CHALLENGE_CATEGORIES } from '@/features/challenges/data/schema'
import { AdminChallengesTable } from './components/admin-challenges-table'
import { DateTimePicker } from '@/components/datetime-picker'

export function ChallengesManagement() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [timeline, setTimeline] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rules: '',
    prize_pool: '',
    evaluation_criteria: '',
    sponsor_link: '',
    image_url: '',
    category: '',
    status: 'draft',
  })

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createChallenge(data),
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

  const handleOpenDialog = (challenge?: Challenge) => {
    if (challenge) {
      setCurrentChallenge(challenge)
      setTimeline(challenge.timeline ? new Date(challenge.timeline) : undefined)
      setFormData({
        title: challenge.title,
        description: challenge.description,
        rules: challenge.rules || '',
        prize_pool: challenge.prize_pool || '',
        evaluation_criteria: challenge.evaluation_criteria || '',
        sponsor_link: challenge.sponsor_link || '',
        image_url: challenge.image_url || '',
        category: challenge.category || '',
        status: challenge.status,
      })
      setImagePreview(challenge.image_url || '')
    } else {
      setCurrentChallenge(null)
      setTimeline(undefined)
      setFormData({
        title: '',
        description: '',
        rules: '',
        prize_pool: '',
        evaluation_criteria: '',
        sponsor_link: '',
        image_url: '',
        category: '',
        status: 'draft',
      })
      setImagePreview('')
    }
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setCurrentChallenge(null)
    setImageFile(null)
    setImagePreview('')
    setTimeline(undefined)
    setFormData({
      title: '',
      description: '',
      rules: '',
      prize_pool: '',
      evaluation_criteria: '',
      sponsor_link: '',
      image_url: '',
      category: '',
      status: 'draft',
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: '' })
  }

  const handleSubmit = async () => {
    try {
      setIsUploading(true)
      let imageUrl = formData.image_url

      // Upload image if a new file is selected
      if (imageFile) {
        imageUrl = await uploadChallengeImage(imageFile)
      }

      const dataToSubmit = {
        ...formData,
        image_url: imageUrl,
        timeline: timeline ? timeline.toISOString() : null,
      }

      if (currentChallenge) {
        updateMutation.mutate({ id: currentChallenge.id, data: dataToSubmit })
      } else {
        createMutation.mutate(dataToSubmit)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (challenge: Challenge) => {
    setCurrentChallenge(challenge)
    setTimeline(challenge.timeline ? new Date(challenge.timeline) : undefined)
    setFormData({
      title: challenge.title,
      description: challenge.description,
      rules: challenge.rules || '',
      prize_pool: challenge.prize_pool || '',
      evaluation_criteria: challenge.evaluation_criteria || '',
      sponsor_link: challenge.sponsor_link || '',
      image_url: challenge.image_url || '',
      category: challenge.category || '',
      status: challenge.status,
    })
    setIsDialogOpen(true)
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
              <AdminChallengesTable data={challenges} onEdit={handleEdit} />
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
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div>
                      <Label htmlFor='category'>Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger id='category'>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          {CHALLENGE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor='image'>Challenge Image</Label>
                      <div className='space-y-2'>
                        {(imagePreview || formData.image_url) && (
                          <div className='relative'>
                            <img
                              src={imagePreview || formData.image_url}
                              alt='Preview'
                              className='h-24 w-full rounded-md object-cover'
                            />
                            <Button
                              type='button'
                              variant='destructive'
                              size='icon'
                              className='absolute right-1 top-1 h-6 w-6'
                              onClick={handleRemoveImage}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        )}
                        <div className='flex items-center gap-2'>
                          <Input
                            id='image'
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='cursor-pointer'
                          />
                          <Upload className='h-4 w-4 text-muted-foreground' />
                        </div>
                      </div>
                    </div>
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
                    <Label htmlFor='timeline'>Publish Date & Time</Label>
                    <DateTimePicker
                      selected={timeline}
                      onSelect={setTimeline}
                      placeholder='Select publish date and time'
                      disabled={(date: Date) => date < new Date()}
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
