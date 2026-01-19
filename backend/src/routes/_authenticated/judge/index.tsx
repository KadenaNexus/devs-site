import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getAssignedChallenges } from '@/services/judges'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/judge/')({
  component: JudgeDashboard,
})

function JudgeDashboard() {
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    getAssignedChallenges().then(setChallenges)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Assigned Challenges</h1>

      {challenges.map((c) => (
        <Card key={c.id} className="p-4">
          <div className="font-medium">{c.title}</div>
        </Card>
      ))}
    </div>
  )
}
