import { supabase } from '@/services/supabase'

export interface AdminLoginCredentials {
  email: string
  password: string
}

export async function adminLogin({ email, password }: AdminLoginCredentials) {
  // Sign in with Supabase auth
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

  // Check if user has admin role in metadata
  const role = (user.user_metadata?.role as string | undefined)
  if (role !== 'admin') {
    // Sign out if not admin
    await supabase.auth.signOut()
    throw new Error('Only admin users can access this area')
  }

  return {
    user: {
      id: user.id,
      email: user.email!,
      username: user.user_metadata?.name || user.user_metadata?.username || user.email!,
    },
    accessToken: session.access_token,
  }
}

export async function adminLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getAdminSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  
  const session = data.session
  if (!session?.user) return null

  const role = (session.user.user_metadata?.role as string | undefined)
  if (role !== 'admin') return null

  return {
    user: {
      id: session.user.id,
      email: session.user.email!,
      username: session.user.user_metadata?.name || session.user.user_metadata?.username || session.user.email!,
    },
    accessToken: session.access_token,
  }
}
