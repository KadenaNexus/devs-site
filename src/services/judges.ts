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

export const fetchScoreBySubmissionAndJudge = async (
  submissionId: string,
  judgeUserId: string
) => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('submission_id', submissionId)
    .eq('judge_user_id', judgeUserId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}

export const upsertScore = async (payload: any) => {
  try {
    console.log('=== UPSERT SCORE START ===')
    console.log('Raw payload:', payload)
    console.log('Payload types:', {
      submission_id: {
        type: typeof payload.submission_id,
        value: payload.submission_id,
      },
      judge_user_id: {
        type: typeof payload.judge_user_id,
        value: payload.judge_user_id,
      },
      impact: {
        type: typeof payload.impact,
        isInteger: Number.isInteger(payload.impact),
        value: payload.impact,
      },
      execution: {
        type: typeof payload.execution,
        isInteger: Number.isInteger(payload.execution),
        value: payload.execution,
      },
      innovation: {
        type: typeof payload.innovation,
        isInteger: Number.isInteger(payload.innovation),
        value: payload.innovation,
      },
      security: {
        type: typeof payload.security,
        isInteger: Number.isInteger(payload.security),
        value: payload.security,
      },
      ux_clarity: {
        type: typeof payload.ux_clarity,
        isInteger: Number.isInteger(payload.ux_clarity),
        value: payload.ux_clarity,
      },
      notes: { type: typeof payload.notes, value: payload.notes },
      is_final: { type: typeof payload.is_final, value: payload.is_final },
    })

    // First try to find existing score
    const existing = await fetchScoreBySubmissionAndJudge(
      payload.submission_id,
      payload.judge_user_id
    )

    if (existing) {
      console.log('Updating existing score:', existing.id)
      // Update existing score - only update the fields we need
      const updateData = {
        impact: payload.impact,
        execution: payload.execution,
        innovation: payload.innovation,
        security: payload.security,
        ux_clarity: payload.ux_clarity,
        notes: payload.notes,
        is_final: payload.is_final,
      }
      console.log('UPDATE data being sent:', updateData)

      const { error } = await supabase
        .from('scores')
        .update(updateData)
        .eq('id', existing.id)

      if (error) {
        console.error('Update error:', error)
        throw error
      }
      console.log('✓ Score updated successfully')
    } else {
      console.log('No existing score found, inserting new one')
      // Insert new score with all required fields
      // Only include fields that should be sent - let database defaults handle the rest
      const insertData = {
        submission_id: payload.submission_id,
        judge_user_id: payload.judge_user_id,
        impact: parseInt(String(payload.impact), 10),
        execution: parseInt(String(payload.execution), 10),
        innovation: parseInt(String(payload.innovation), 10),
        security: parseInt(String(payload.security), 10),
        ux_clarity: parseInt(String(payload.ux_clarity), 10),
      } as any

      // Only add optional fields if they're not null/undefined
      if (payload.notes !== null && payload.notes !== undefined) {
        insertData.notes = payload.notes
      }

      if (payload.is_final !== null && payload.is_final !== undefined) {
        insertData.is_final = payload.is_final
      }

      console.log('INSERT data being sent:', insertData)
      console.log('INSERT data types:', {
        impact: {
          type: typeof insertData.impact,
          isInt: Number.isInteger(insertData.impact),
          value: insertData.impact,
        },
        execution: {
          type: typeof insertData.execution,
          isInt: Number.isInteger(insertData.execution),
          value: insertData.execution,
        },
        innovation: {
          type: typeof insertData.innovation,
          isInt: Number.isInteger(insertData.innovation),
          value: insertData.innovation,
        },
        security: {
          type: typeof insertData.security,
          isInt: Number.isInteger(insertData.security),
          value: insertData.security,
        },
        ux_clarity: {
          type: typeof insertData.ux_clarity,
          isInt: Number.isInteger(insertData.ux_clarity),
          value: insertData.ux_clarity,
        },
      })

      const { error } = await supabase.from('scores').insert([insertData])

      if (error) {
        console.error('=== INSERT ERROR ===')
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Insert data was:', insertData)
        throw error
      }
      console.log('✓ Score inserted successfully')
    }
    console.log('=== UPSERT SCORE END ===')
  } catch (error) {
    console.error('=== UPSERT SCORE CATCH BLOCK ===')
    console.error('Full error:', error)
    throw error
  }
}
