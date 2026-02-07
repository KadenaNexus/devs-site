import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { signInWithEmail, signInWithGoogle } from '@/services/auth'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { IconGoogle } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
import { useAdminStore } from '@/stores/admin-store'
import { sleep, cn } from '@/lib/utils'
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

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { logout: adminLogout } = useAdminStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /**
   * @param {{ email: string; password: string }} data
   */
  async function onSubmit(data: { email: any; password: any }) {
    try {
      setIsLoading(true)

      const result = await signInWithEmail({
        email: data.email,
        password: data.password,
      })

      if (!result.user.email) {
        throw new Error('User email not found')
      }

      auth.setUser({
        id: result.user.id,
        email: result.user.email,
        role: result.role,
      })

      auth.setAccessToken(result.accessToken)

      // Clear any admin session if this is not an admin login
      if (result.role !== 'admin') {
        adminLogout()
      }

      toast.success(`Welcome back, ${result.user.email}`)

      // If there's a redirect URL, use it (for returning to protected pages)
      if (redirectTo) {
        navigate({ to: redirectTo, replace: true })
        return
      }

      // Role-based default redirects
      if (result.role === 'judge') {
        navigate({ to: '/judge-dashboard' })
        return
      }

      if (result.role === 'admin') {
        navigate({ to: '/admin' })
        return
      }

      // Default redirect for public users
      navigate({
        to: '/dashboard',
        replace: true,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid email or password'

      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            type='button'
            disabled={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true)
                // For judge OAuth flow, send role=judge so we can persist metadata after redirect
                await signInWithGoogle('judge')
              } catch (error) {
                toast.error('Google sign-in failed')
                setIsLoading(false)
              }
            }}
          >
            <IconGoogle className='h-4 w-4' /> Google
          </Button>
        </div>
      </form>
    </Form>
  )
}
