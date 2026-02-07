import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/services/supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { JudgesSignUpForm } from './components/judges-sign-up-form'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  const location = useLocation()
  const navigate = useNavigate()

  // Check if user is already logged in
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
    staleTime: 5 * 60 * 1000,
  })

  // Get user role
  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null
      return (user?.user_metadata?.role as string | undefined)?.toLowerCase() || null
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  // Redirect logged-in users to appropriate dashboard
  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'admin') {
        navigate({ to: '/admin/dashboard' })
      } else if (userRole === 'judge') {
        navigate({ to: '/judge-dashboard' })
      } else {
        navigate({ to: '/dashboard' })
      }
    }
  }, [user, userRole, navigate])

  const isJudgesSignup = location.pathname === '/judges-sign-up'
  return (
    <AuthLayout>
      <Card className='mx-auto w-full border-muted shadow-lg'>
        <CardHeader className='space-y-2 pb-4'>
          <CardTitle className='text-2xl font-semibold tracking-tight'>
            {isJudgesSignup ? 'Judge Registration' : 'Create an account'}
          </CardTitle>
          <CardDescription className='text-sm leading-relaxed'>
            {isJudgesSignup ? (
              <>
                Register as a judge to evaluate submissions. <br className='sm:hidden' />
                Already registered?{' '}
                <Link
                  to='/sign-in'
                  className='hover:text-primary font-medium underline underline-offset-4'
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                Enter your email and password to create an account. <br className='sm:hidden' />
                Already have an account?{' '}
                <Link
                  to='/sign-in'
                  className='hover:text-primary font-medium underline underline-offset-4'
                >
                  Sign In
                </Link>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className='pb-6'>
          {isJudgesSignup ? <JudgesSignUpForm /> : <SignUpForm />}
        </CardContent>
        <CardFooter className='border-t bg-muted/30 px-6 py-4'>
          <p className='text-muted-foreground mx-auto max-w-md text-center text-xs leading-relaxed sm:text-sm'>
            By creating an account, you agree to our{' '}
            <a
              href='/terms'
              className='hover:text-primary font-medium underline underline-offset-4'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='hover:text-primary font-medium underline underline-offset-4'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
