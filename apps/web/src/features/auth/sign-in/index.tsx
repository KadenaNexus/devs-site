import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { persistUserRole } from '@/services/auth'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { useAdminStore } from '@/stores/admin-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const search = useSearch({ from: '/(auth)/sign-in' })

  //   useEffect(() => {
  //     if (!search.role) return

  //     async function handleOAuthRole() {
  //       await persistUserRole(search.role)

  //       navigate({
  //         to: search.role === 'judge' ? '/judge' : '/dashboard',
  //         replace: true,
  //       })
  //     }

  //     handleOAuthRole()
  //   }, [search.role])
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { logout: adminLogout } = useAdminStore()

  // Persist OAuth role from query (e.g., sign-in?role=judge) if user metadata missing
  useEffect(() => {
    const persistRoleIfNeeded = async () => {
      if (!search.role) return

      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) return

      const currentRole = user.user_metadata?.role as string | undefined
      if (!currentRole) {
        await persistUserRole(search.role as any)
      }
    }

    persistRoleIfNeeded()
  }, [search.role])

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) return

      const user = session.user
      const role = (user.user_metadata?.role as string | undefined) ?? 'public'

      auth.setUser({
        id: user.id,
        email: user.email!,
        role,
      })

      auth.setAccessToken(session.access_token)

      // If not admin, clear any lingering admin session cookies
      if (role !== 'admin') {
        adminLogout()
      }

      // ✅ ROLE BASED REDIRECT
      if (role === 'judge') {
        navigate({ to: '/judge-dashboard', replace: true })
      } else {
        navigate({ to: '/dashboard', replace: true })
      }
    }

    handleRedirect()
  }, [auth, navigate])

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to <br />
            log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking sign in, you agree to our{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
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
