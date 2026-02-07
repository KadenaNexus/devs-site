import { supabase } from './supabase'
import { type Challenge } from '@/features/challenges/data/schema'

// ============= IMAGE UPLOAD =============

export async function uploadChallengeImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `challenges/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('challenge-images')
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from('challenge-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// ============= CHALLENGES =============

export async function createChallenge(data: Partial<Challenge>) {
  // Get current user for created_by field
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    throw new Error('Only admins can create challenges')
  }

  const { data: result, error } = await supabase
    .from('challenges')
    .insert([
      {
        title: data.title,
        description: data.description,
        rules: data.rules || null,
        timeline: data.timeline || null,
        prize_pool: data.prize_pool || null,
        evaluation_criteria: data.evaluation_criteria || null,
        sponsor_link: data.sponsor_link || null,
        image_url: data.image_url || null,
        category: data.category || null,
        status: data.status || 'draft',
        created_by: user.id, // Use authenticated user ID
      },
    ])
    .select()

  if (error) {
    console.error('Create challenge error:', error)
    throw error
  }

  // Return the first item if array, or null
  return result && result.length > 0 ? result[0] : null
}

export async function updateChallenge(id: string, data: Partial<Challenge>) {
  console.log('=== UPDATE CHALLENGE DEBUG ===')
  console.log('Challenge ID:', id)
  console.log('Update data:', data)
  
  // Get current user to verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user?.id, user?.email)
  console.log('User role:', user?.user_metadata?.role)

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    throw new Error('Only admins can update challenges')
  }
  
  // First check if the challenge exists and is visible
  const { data: existing, error: selectError } = await supabase
    .from('challenges')
    .select('id, title, status')
    .eq('id', id)
    .maybeSingle()

  console.log('Existing challenge:', existing)
  console.log('Select error:', selectError)

  if (selectError) {
    console.error('Error checking challenge:', selectError)
    throw selectError
  }

  if (!existing) {
    throw new Error('Challenge not found or you do not have permission to view it')
  }

  // Perform the update
  const updatePayload = {
    title: data.title,
    description: data.description,
    rules: data.rules || null,
    timeline: data.timeline || null,
    prize_pool: data.prize_pool || null,
    evaluation_criteria: data.evaluation_criteria || null,
    sponsor_link: data.sponsor_link || null,
    image_url: data.image_url || null,
    category: data.category || null,
    status: data.status,
  }
  
  console.log('Update payload:', updatePayload)

  const { data: result, error } = await supabase
    .from('challenges')
    .update(updatePayload)
    .eq('id', id)
    .select()

  console.log('Update result:', result)
  console.log('Update error:', error)

  if (error) {
    console.error('Update challenge error:', error)
    throw error
  }

  if (!result || result.length === 0) {
    throw new Error('Update succeeded but no data returned. This might be an RLS issue.')
  }

  // Return the first item
  console.log('Returning updated challenge:', result[0])
  return result[0]
}

export async function deleteChallenge(id: string) {
  // Get current user to verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole !== 'admin') {
    throw new Error('Only admins can delete challenges')
  }

  const { error } = await supabase.from('challenges').delete().eq('id', id)

  if (error) throw error
}

export async function toggleChallengeStatus(id: string, status: 'open' | 'closed' | 'draft') {
  const { data: result, error } = await supabase
    .from('challenges')
    .update({ status })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Toggle status error:', error)
    throw error
  }

  // Return the first item if array, or null
  return result && result.length > 0 ? result[0] : null
}

// ============= JUDGES =============

export interface Judge {
  id: string
  email: string
  name: string
  created_at: string
}

export async function fetchJudges(): Promise<Judge[]> {
  // Call Postgres function to get judges (requires admin role)
  const { data, error } = await supabase.rpc('list_judges')

  if (error) {
    console.error('Error fetching judges:', error)
    return []
  }

  return data || []
}

export async function fetchJudgeById(judgeId: string): Promise<Judge | null> {
  const judges = await fetchJudges()
  return judges.find(j => j.id === judgeId) || null
}

export async function fetchJudgeAssignedChallenges(judgeId: string) {
  const { data, error } = await supabase
    .from('challenge_judges')
    .select(`
      challenge_id,
      created_at,
      challenges (
        id,
        title,
        description,
        status,
        prize_pool,
        created_at
      )
    `)
    .eq('judge_id', judgeId)

  if (error) {
    console.error('Error fetching judge challenges:', error)
    return []
  }

  return data?.map(item => ({
    assignedAt: item.created_at,
    ...item.challenges
  })) || []
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

export async function inviteJudge(
  email: string,
  name: string,
  password: string
) {
  const { data, error } = await supabase.functions.invoke('invite-judge', {
    body: { email, name, password },
  })

  if (error) {
    console.error('Invite Judge Error:', {
      message: error.message,
      name: error.name,
      status: error.status,
      context: error.context,
    })

    throw new Error(
      error.context?.error ||
      error.message ||
      'Failed to invite judge'
    )
  }

  return data
}

// ============= SUBMISSIONS =============

export async function fetchSubmissionsWithDetails(challengeId?: string) {
  // First, fetch all submissions
  let submissionsQuery = supabase
    .from('submissions')
    .select(`
      *,
      challenges!inner (
        id,
        title
      )
    `)
    .order('created_at', { ascending: false })

  if (challengeId) {
    submissionsQuery = submissionsQuery.eq('challenge_id', challengeId)
  }

  const { data: submissions, error: submissionsError } = await submissionsQuery

  if (submissionsError) {
    console.error('Error fetching submissions:', submissionsError)
    throw submissionsError
  }

  // Fetch all scores for these submissions
  const submissionIds = submissions?.map(s => s.id) || []
  const { data: allScores, error: scoresError } = await supabase
    .from('scores')
    .select('*')
    .in('submission_id', submissionIds)

  if (scoresError) {
    console.error('Error fetching scores:', scoresError)
  }

  console.log('Submissions:', submissions?.length)
  console.log('Scores fetched:', allScores?.length)
  
  // Group scores by submission_id
  const scoresBySubmission = new Map<string, any[]>()
  allScores?.forEach(score => {
    const existing = scoresBySubmission.get(score.submission_id) || []
    existing.push(score)
    scoresBySubmission.set(score.submission_id, existing)
  })
  
  // Fetch judges data
  const judges = await fetchJudges()
  const judgesMap = new Map(judges.map(j => [j.id, j]))

  // Process submissions with calculated average scores
  return submissions?.map((submission: any) => {
    const scores = scoresBySubmission.get(submission.id) || []
    
    console.log(`Submission ${submission.project_title} has ${scores.length} scores`)
    
    // Calculate average score
    let averageScore = 0
    if (scores.length > 0) {
      const totalScore = scores.reduce((sum: number, score: any) => {
        const impact = score.impact || 0
        const execution = score.execution || 0
        const innovation = score.innovation || 0
        const security = score.security || 0
        const uxClarity = score.ux_clarity || 0
        const scoreSum = impact + execution + innovation + security + uxClarity
        console.log(`  Score: impact=${impact}, execution=${execution}, innovation=${innovation}, security=${security}, ux_clarity=${uxClarity}, sum=${scoreSum}`)
        return sum + scoreSum
      }, 0)
      averageScore = totalScore / (scores.length * 5) // Divide by number of scores and 5 criteria
      console.log(`  Total: ${totalScore}, Average: ${averageScore}`)
    }

    // Get unique judges who scored this submission
    const uniqueJudgeIds = [...new Set(scores.map((s: any) => s.judge_user_id))] as string[]
    const judgeNames = uniqueJudgeIds
      .map((id: string) => judgesMap.get(id)?.name || 'Unknown')
      .join(', ')

    return {
      ...submission,
      challenge_name: submission.challenges?.title || 'Unknown',
      judge_names: judgeNames || 'Not scored yet',
      average_score: averageScore,
      score_count: scores.length
    }
  }) || []
}

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

// Fetch individual scores for a submission with judge names
export async function fetchSubmissionScores(submissionId: string) {
  const { data: scores, error } = await supabase
    .from('scores')
    .select('*')
    .eq('submission_id', submissionId)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Fetch judges data
  const judges = await fetchJudges()
  const judgesMap = new Map(judges.map(j => [j.id, j]))

  // Map scores with judge names and calculate totals
  return scores?.map(score => ({
    ...score,
    judge_name: judgesMap.get(score.judge_user_id)?.name || 'Unknown Judge',
    total: score.impact + score.execution + score.innovation + score.security + score.ux_clarity
  })) || []
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

export async function fetchWinners(challengeId?: string) {
  let query = supabase
    .from('winners')
    .select(`
      *,
      challenges (
        id,
        title,
        prize_pool
      ),
      submissions (
        id,
        developer_name,
        project_title,
        email
      )
    `)
    .order('announced_at', { ascending: false })

  if (challengeId) {
    query = query.eq('challenge_id', challengeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching winners:', error)
    throw error
  }

  return data?.map((winner: any) => ({
    ...winner,
    challenge_name: winner.challenges?.title || 'Unknown',
    developer_name: winner.submissions?.developer_name || 'Unknown',
    project_title: winner.submissions?.project_title || 'Unknown',
  })) || []
}

export async function announceWinner(data: {
  challengeId: string
  submissionId: string
  rank: number
  prizeAmount?: number
}) {
  const { data: winner, error } = await supabase
    .from('winners')
    .insert([
      {
        challenge_id: data.challengeId,
        submission_id: data.submissionId,
        rank: data.rank,
        prize_amount: data.prizeAmount,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return winner
}

export async function deleteWinner(winnerId: string) {
  const { error } = await supabase
    .from('winners')
    .delete()
    .eq('id', winnerId)

  if (error) throw error
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
