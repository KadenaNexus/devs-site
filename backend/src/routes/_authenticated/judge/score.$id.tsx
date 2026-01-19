import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { upsertScore } from '@/services/judges'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute(
  '/_authenticated/judge/score/$id'
)({
  component: ScoreSubmission,
})

function ScoreSubmission() {
  const { id: submissionId } = Route.useParams()

  const [score, setScore] = useState({
    impact: 0,
    execution: 0,
    innovation: 0,
    security: 0,
    ux_clarity: 0,
    notes: '',
  })

  const submitFinal = async () => {
    await upsertScore({
      submission_id: submissionId,
      ...score,
      is_final: true,
    })
    alert('Final score submitted')
  }

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">Score Submission</h1>

      {Object.keys(score).map(
        (k) =>
          k !== 'notes' && (
            <Input
              key={k}
              type="number"
              placeholder={k}
              onChange={(e) =>
                setScore({ ...score, [k]: Number(e.target.value) })
              }
            />
          )
      )}

      <Button onClick={submitFinal}>Submit Final Score</Button>
    </div>
  )
}
