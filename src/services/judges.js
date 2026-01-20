import { supabase } from '@/services/supabase'


export const getAssignedChallenges = async () => {
  const { data, error } = await supabase
    .from('challenge_judges')
    .select(`
      challenges (
        id,
        title,
        status
      )
    `)

  if (error) throw error
  return data.map(d => d.challenges)
}

export const getSubmissionsForChallenge = async (challengeId) => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('challenge_id', challengeId)

  if (error) throw error
  return data
}

export const upsertScore = async (payload) => {
  const { error } = await supabase.from('scores').upsert(payload)
  if (error) throw error
}

