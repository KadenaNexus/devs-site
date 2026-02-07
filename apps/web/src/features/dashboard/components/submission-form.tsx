import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/services/supabase'
import {
  createSubmission,
  updateSubmission,
  uploadProfilePic,
  type Submission,
} from '@/services/submissions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Upload } from 'lucide-react'

const submissionSchema = z.object({
  developer_name: z.string().min(1, 'Developer/Team name is required'),
  email: z.string().email('Valid email is required'),
  discord: z.string().optional(),
  telegram: z.string().optional(),
  project_title: z.string().min(1, 'Project title is required'),
  problem_statement: z.string().optional(),
  solution_description: z.string().min(10, 'Please provide a detailed solution description'),
  github_url: z.string().url('Valid GitHub URL is required').optional().or(z.literal('')),
  demo_url: z.string().url('Valid demo URL is required').optional().or(z.literal('')),
  smart_contract_details: z.string().optional(),
})

type SubmissionFormValues = z.infer<typeof submissionSchema>

interface SubmissionFormProps {
  challengeId: string
  existingSubmission?: Submission | null
  onClose: () => void
}

export function SubmissionForm({
  challengeId,
  existingSubmission,
  onClose,
}: SubmissionFormProps) {
  const [profilePicUrl, setProfilePicUrl] = useState<string>(
    existingSubmission?.profile_pic || ''
  )
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      developer_name: existingSubmission?.developer_name || '',
      email: existingSubmission?.email || '',
      discord: existingSubmission?.discord || '',
      telegram: existingSubmission?.telegram || '',
      project_title: existingSubmission?.project_title || '',
      problem_statement: existingSubmission?.problem_statement || '',
      solution_description: existingSubmission?.solution_description || '',
      github_url: existingSubmission?.github_url || '',
      demo_url: existingSubmission?.demo_url || '',
      smart_contract_details: existingSubmission?.smart_contract_details || '',
    },
  })

  const submitMutation = useMutation({
    mutationFn: async (values: SubmissionFormValues) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.id) throw new Error('User not authenticated')

      const submissionData = {
        challenge_id: challengeId,
        submitted_by: user.id,
        ...values,
        profile_pic: profilePicUrl,
        status: 'pending' as const,
        is_public: false,
      }

      if (existingSubmission) {
        return updateSubmission(existingSubmission.id, submissionData)
      } else {
        return createSubmission(submissionData)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission', challengeId] })
      queryClient.invalidateQueries({ queryKey: ['my-submissions'] })
      toast.success(
        existingSubmission
          ? 'Submission updated successfully!'
          : 'Submission created successfully! You will receive a confirmation email shortly.'
      )
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit. Please try again.')
    },
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    try {
      setUploading(true)
      const url = await uploadProfilePic(file)
      setProfilePicUrl(url)
      toast.success('Profile picture uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = (values: SubmissionFormValues) => {
    submitMutation.mutate(values)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {existingSubmission ? 'Edit Submission' : 'Submit Your Project'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details about your project. You can edit this submission until
            the challenge deadline.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Profile Picture */}
            <div className='flex items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src={profilePicUrl} />
                <AvatarFallback>
                  {form.watch('developer_name')?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <label htmlFor='profile-pic' className='cursor-pointer'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={uploading}
                    onClick={() => document.getElementById('profile-pic')?.click()}
                  >
                    {uploading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Upload className='mr-2 h-4 w-4' />
                    )}
                    Upload Profile Picture
                  </Button>
                </label>
                <input
                  id='profile-pic'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileUpload}
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='developer_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer/Team Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Your name or team name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='your@email.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='discord'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Username</FormLabel>
                    <FormControl>
                      <Input placeholder='username#1234' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='telegram'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram Username</FormLabel>
                    <FormControl>
                      <Input placeholder='@username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='project_title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title *</FormLabel>
                  <FormControl>
                    <Input placeholder='My Awesome Project' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='problem_statement'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Statement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='What problem does your project solve?'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='solution_description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe your solution in detail...'
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of your solution
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='github_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repository</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://github.com/...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='demo_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo/Live URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='smart_contract_details'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Smart Contract/Module Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Contract addresses, module details, deployment information...'
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include contract addresses, network details, and any relevant deployment information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={submitMutation.isPending}>
                {submitMutation.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {existingSubmission ? 'Update Submission' : 'Submit Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
