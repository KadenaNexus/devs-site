import { supabase } from '@/services/supabase'

/**
 * Check if the current judge is assigned to a specific challenge
 */
export async function isJudgeAssignedToChallenge(
  challengeId: string
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) return false

  // Check user role
  const role = user.user_metadata?.role || user.app_metadata?.role

  // Admins can access everything
  if (role === 'admin') return true

  // For judges, check assignment
  if (role === 'judge') {
    const { data, error } = await supabase
      .from('challenge_judges')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('judge_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error checking judge assignment:', error)
      return false
    }

    return !!data
  }

  // Public users cannot access judge routes
  return false
}

/**
 * Get user role from auth
 */
export async function getUserRole(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return user.user_metadata?.role || user.app_metadata?.role || 'public'
}

/**
 * Check if user has required role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const role = await getUserRole()
  return role === requiredRole
}

/**
 * Check if user has any of the required roles
 */
export async function hasAnyRole(requiredRoles: string[]): Promise<boolean> {
  const role = await getUserRole()
  return role ? requiredRoles.includes(role) : false
}
