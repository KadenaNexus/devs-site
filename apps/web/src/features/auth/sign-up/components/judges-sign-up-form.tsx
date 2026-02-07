import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithGoogle, signUpWithEmail } from '@/services/auth'
import { toast } from 'sonner'
import { IconGoogle } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Please enter your email' : undefined,
    }),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(7, 'Password must be at least 7 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function JudgesSignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      await signUpWithEmail({
        email: data.email,
        password: data.password,
        role: 'judge',
      })

      toast.success('Account created! Please check your email.')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-4', className)}
        {...props}
      >
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type='email'
                    placeholder='judge@example.com' 
                    className='h-10'
                    {...field} 
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />

          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>Password</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      placeholder='Create a strong password' 
                      className='h-10'
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput 
                      placeholder='Re-enter your password' 
                      className='h-10'
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type='submit'
          className='mt-6 h-10 w-full font-medium' 
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Judge Account'}
        </Button>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2 font-medium'>
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={() => signInWithGoogle('judge')}
          disabled={isLoading}
          className='h-10 w-full font-medium'
        >
          <IconGoogle className='mr-2 h-4 w-4' />
          Sign up with Google
        </Button>
      </form>
    </Form>
  )
}
