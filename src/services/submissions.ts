import { supabase } from './supabase'

export interface Submission {
  id: string
  challenge_id: string
  submitted_by: string
  developer_name: string
  email: string
  discord?: string
  telegram?: string
  profile_pic?: string
  project_title: string
  problem_statement?: string
  solution_description?: string
  github_url?: string
  demo_url?: string
  smart_contract_details?: string
  status: 'submitted' | 'approved' | 'winner' | 'rejected'
  is_public: boolean
  created_at: string
  updated_at?: string
}

export async function fetchMySubmissions(): Promise<Submission[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) return []

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching my submissions:', error)
    throw new Error('Failed to fetch submissions')
  }

  return data || []
}

export async function fetchSubmissionByChallenge(
  challengeId: string
): Promise<Submission | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) return null

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('challenge_id', challengeId)
    .eq('submitted_by', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    console.error('Error fetching submission:', error)
    return null
  }

  return data
}

export async function createSubmission(
  submission: Omit<Submission, 'id' | 'created_at' | 'updated_at'>
): Promise<Submission> {
  const { data, error } = await supabase
    .from('submissions')
    .insert([submission])
    .select()
    .single()

  if (error) {
    console.error('Error creating submission:', error)
    throw new Error('Failed to create submission')
  }

  return data
}

export async function updateSubmission(
  id: string,
  updates: Partial<Submission>
): Promise<Submission> {
  const { data, error } = await supabase
    .from('submissions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating submission:', error)
    throw new Error('Failed to update submission')
  }

  return data
}

export async function fetchApprovedSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, challenges(title)')
    .in('status', ['approved', 'winner'])
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching approved submissions:', error)
    throw new Error('Failed to fetch approved submissions')
  }

  return data || []
}

export async function fetchWinners(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, challenges(title, prize_pool)')
    .eq('status', 'winner')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching winners:', error)
    throw new Error('Failed to fetch winners')
  }

  return data || []
}

export async function uploadProfilePic(file: File): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) throw new Error('User not authenticated')

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `profile-pics/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('submissions')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading profile pic:', uploadError)
    throw new Error('Failed to upload profile picture')
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('submissions').getPublicUrl(filePath)

  return publicUrl
}
