import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/services/supabase'
import { Button } from '@/components/ui/button'
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
import { PasswordInput } from '@/components/password-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.string().email(),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function ProfileForm() {
  const queryClient = useQueryClient()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')

  // Fetch current user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    },
  })

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.user_metadata?.username || '',
      email: user?.email || '',
    },
    values: {
      username: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
      email: user?.email || '',
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      let avatarUrl = user?.user_metadata?.avatar_url

      // Upload avatar if a new file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `avatar.${fileExt}`
        const filePath = `${user?.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload avatar: ${uploadError.message}`)
        }

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        avatarUrl = urlData.publicUrl
      }

      const { data, error } = await supabase.auth.updateUser({
        data: { 
          username: values.username,
          avatar_url: avatarUrl,
        },
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setAvatarFile(null)
      setAvatarPreview('')
      toast.success('Profile updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      // First verify current password by attempting sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: values.currentPassword,
      })
      
      if (verifyError) throw new Error('Current password is incorrect')

      // Update to new password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      })
      
      if (error) throw error
    },
    onSuccess: () => {
      passwordForm.reset()
      toast.success('Password changed successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB')
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const currentAvatar = avatarPreview || user?.user_metadata?.avatar_url || '/avatars/shadcn.jpg'
  const userInitials = (user?.user_metadata?.username || user?.email?.split('@')[0] || 'U').slice(0, 2).toUpperCase()

  return (
    <div className='space-y-8'>
      {/* Profile Form */}
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit((data) =>
            updateProfileMutation.mutate(data)
          )}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Profile Information</h3>

            {/* Profile Image Upload */}
            <div className='space-y-2'>
              <FormLabel>Profile Picture</FormLabel>
              <div className='flex items-center gap-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage src={currentAvatar} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-2'>
                  <Input
                    id='avatar'
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => document.getElementById('avatar')?.click()}
                  >
                    <Upload className='mr-2 h-4 w-4' />
                    Upload Image
                  </Button>
                  <p className='text-xs text-muted-foreground'>
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </div>
            
            <FormField
              control={profileForm.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your username' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Your email address cannot be changed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type='submit'
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Update Profile
          </Button>
        </form>
      </Form>

      {/* Password Change Form */}
      <div className='border-t pt-8'>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit((data) =>
              changePasswordMutation.mutate(data)
            )}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Change Password</h3>

              <FormField
                control={passwordForm.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter current password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter new password'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 6 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Confirm new password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type='submit'
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Change Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
