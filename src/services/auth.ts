import { supabase } from './supabase'

export type UserRole = 'public' | 'judge' | 'admin'

type SignUpInput = {
  email: string
  password: string
  role: UserRole
}

interface SignInWithEmailParams {
  email: string
  password: string
}
/* ----------------------------------
   Email + Password Sign Up
---------------------------------- */
export async function signUpWithEmail({ email, password, role }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role }, // ✅ saved in user_metadata
    },
  })

  if (error) throw error
  return data
}

/* ----------------------------------
   Google OAuth Sign In / Sign Up
---------------------------------- */
export async function signInWithGoogle(role: UserRole) {
  const redirectPath =
    role === 'judge' ? '/sign-in?role=judge' : '/sign-in?role=public'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${redirectPath}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) throw error
  return data
}
export async function persistUserRole(role: UserRole) {
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) return

  // Prevent overwrite
  if (user.user_metadata?.role) return

  await supabase.auth.updateUser({
    data: { role }, // ✅ THIS goes into raw_user_meta_data
  })
}

export async function signInWithEmail({
  email,
  password,
}: SignInWithEmailParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  const user = data.user
  const session = data.session

  if (!user || !session) {
    throw new Error('Authentication failed')
  }

  // ✅ Role from auth metadata (JWT)
  const role = (user.user_metadata?.role as string | undefined) ?? 'public'

  return {
    user,
    role,
    accessToken: session.access_token,
  }
}
