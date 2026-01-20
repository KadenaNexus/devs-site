import { supabase } from "./supabase"


export type UserRole = 'public' | 'judge' | 'admin'

type SignUpInput = {
  email: string
  password: string
  role: UserRole
}

/* ----------------------------------
   Email + Password Sign Up
---------------------------------- */
export async function signUpWithEmail({
  email,
  password,
  role,
}: SignUpInput) {
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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/login`,
      queryParams: {
        role, // ✅ dynamic role
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) throw error
  return data
}

export async function signInWithEmail({ email, password }) {
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

  // Fetch role from profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle() // ✅ <-- use maybeSingle

  if (profileError) throw profileError

  return {
    user,
    role: profile?.role ?? 'public', // fallback if profile missing
    accessToken: session.access_token,
  }
}

