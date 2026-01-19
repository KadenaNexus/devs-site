import { useState } from 'react'
import { saveScore } from '../../services/judges'

export default function ScoreSubmission({ submissionId, judgeId }) {
  const [score, setScore] = useState({
    impact: 0,
    execution: 0,
    innovation: 0,
    security: 0,
    ux_clarity: 0,
    notes: '',
    is_final: false
  })

  const submitFinal = async () => {
    await saveScore({
      submission_id: submissionId,
      judge_id: judgeId,
      ...score,
      is_final: true
    })
    alert('Final score submitted')
  }

  return (
    <button onClick={submitFinal}>Submit Final Score</button>
  )
}
