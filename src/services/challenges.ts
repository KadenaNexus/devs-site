import { type Challenge } from '@/features/challenges/data/schema'
import { type Submission } from '@/features/challenges/data/submissions-schema'
import { supabase } from './supabase'

export async function fetchChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching challenges:', error)
    throw new Error('Failed to fetch challenges')
  }

  return data || []
}

export async function fetchChallenge(id: string): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching challenge:', error)
    return null
  }

  return data
}

export async function fetchSubmissions(
  challengeId: string
): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching submissions:', error)
    throw new Error('Failed to fetch submissions')
  }

  return data || []
}

export async function fetchSubmission(id: string): Promise<Submission | null> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching submission:', error)
    return null
  }

  return data
}
