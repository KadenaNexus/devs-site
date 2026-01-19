import { supabase } from './supabase'

export const signInWithEmail = async (email) => {
  return supabase.auth.signInWithOtp({ email })
}

export const signOut = async () => {
  return supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user
}
