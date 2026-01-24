import { supabase } from './supabase'
import { type Challenge } from '@/features/challenges/data/schema'

// ============= CHALLENGES =============

export async function createChallenge(data: Partial<Challenge>) {
  const { data: result, error } = await supabase
    .from('challenges')
    .insert([
      {
        title: data.title,
        description: data.description,
        rules: data.rules,
        timeline: data.timeline,
        prize_pool: data.prize_pool,
        evaluation_criteria: data.evaluation_criteria,
        sponsor_link: data.sponsor_link,
        status: data.status || 'draft',
        created_by: data.created_by,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return result
}

export async function updateChallenge(id: string, data: Partial<Challenge>) {
  const { data: result, error } = await supabase
    .from('challenges')
    .update({
      title: data.title,
      description: data.description,
      rules: data.rules,
      timeline: data.timeline,
      prize_pool: data.prize_pool,
      evaluation_criteria: data.evaluation_criteria,
      sponsor_link: data.sponsor_link,
      status: data.status,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function deleteChallenge(id: string) {
  const { error } = await supabase.from('challenges').delete().eq('id', id)

  if (error) throw error
}

export async function toggleChallengeStatus(id: string, status: 'open' | 'closed' | 'draft') {
  const { data: result, error } = await supabase
    .from('challenges')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result
}

// ============= JUDGES =============

export interface Judge {
  id: string
  email: string
  name: string
  created_at: string
}

export async function fetchJudges(): Promise<Judge[]> {
  // Note: Querying auth.users directly may not work with Row Level Security
  // You might need to create a server function or use the admin API
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'judge')

  if (error) {
    console.error('Error fetching judges:', error)
    return []
  }

  return (
    data?.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name || user.email,
      created_at: user.created_at,
    })) || []
  )
}

export async function assignJudgeToChallenge(
  judgeId: string,
  challengeId: string
) {
  const { data, error } = await supabase
    .from('challenge_judges')
    .insert([
      {
        judge_id: judgeId,
        challenge_id: challengeId,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeJudgeFromChallenge(
  judgeId: string,
  challengeId: string
) {
  const { error } = await supabase
    .from('challenge_judges')
    .delete()
    .eq('judge_id', judgeId)
    .eq('challenge_id', challengeId)

  if (error) throw error
}

export async function inviteJudge(email: string, name: string) {
  // This requires admin privileges - you may need to create a Supabase Edge Function
  // For now, this is a placeholder
  const { data, error } = await supabase.functions.invoke('invite-judge', {
    body: { email, name },
  })

  if (error) throw error
  return data
}

// ============= SUBMISSIONS =============

export async function approveSubmission(submissionId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .update({ status: 'approved', is_public: true })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function rejectSubmission(submissionId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .update({ status: 'rejected', is_public: false })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function toggleSubmissionVisibility(
  submissionId: string,
  isPublic: boolean
) {
  const { data, error } = await supabase
    .from('submissions')
    .update({ is_public: isPublic })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============= WINNERS =============

export interface Winner {
  id: string
  challenge_id: string
  submission_id: string
  rank: number
  prize_amount?: string
  created_at: string
}

export async function publishWinners(
  challengeId: string,
  winners: { submissionId: string; rank: number; prizeAmount?: string }[]
) {
  // First, delete existing winners for this challenge
  await supabase.from('winners').delete().eq('challenge_id', challengeId)

  // Insert new winners
  const { data, error } = await supabase
    .from('winners')
    .insert(
      winners.map((w) => ({
        challenge_id: challengeId,
        submission_id: w.submissionId,
        rank: w.rank,
        prize_amount: w.prizeAmount,
      }))
    )
    .select()

  if (error) throw error
  return data
}

export async function fetchWinners(challengeId: string): Promise<Winner[]> {
  const { data, error } = await supabase
    .from('winners')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('rank', { ascending: true })

  if (error) {
    console.error('Error fetching winners:', error)
    throw new Error('Failed to fetch winners')
  }

  return data || []
}

// ============= STATISTICS =============

export async function getAdminStats() {
  const [challengesCount, submissionsCount, usersCount] =
    await Promise.all([
      supabase.from('challenges').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])

  // Get judges count separately
  const { count: judgesCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'judge')

  return {
    totalChallenges: challengesCount.count || 0,
    totalSubmissions: submissionsCount.count || 0,
    totalJudges: judgesCount || 0,
    totalUsers: usersCount.count || 0,
  }
}
