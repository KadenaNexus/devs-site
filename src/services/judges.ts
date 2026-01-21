import { supabase } from '@/services/supabase'

export type Challenge = {
  id: string
  title: string
  status: string
}

export const getAssignedChallenges = async (): Promise<Challenge[]> => {
  const { data, error } = await supabase.from('challenge_judges').select(`
      challenges (
        id,
        title,
        status
      )
    `)

  if (error) throw error

  return (
    data
      ?.flatMap((row) => row.challenges ?? [])
      .map((c) => ({
        id: c.id,
        title: c.title,
        status: c.status,
      })) ?? []
  )
}

// export const getSubmissionsForChallenge = async (challengeId) => {
//   const { data, error } = await supabase
//     .from('submissions')
//     .select('*')
//     .eq('challenge_id', challengeId)

//   if (error) throw error
//   return data
// }

export const upsertScore = async (payload) => {
  const { error } = await supabase.from('scores').upsert(payload)
  if (error) throw error
}
