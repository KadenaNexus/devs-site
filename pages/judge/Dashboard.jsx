import { useEffect, useState } from 'react'
import { getAssignedChallenges } from '../../services/judges'

export default function JudgeDashboard() {
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    getAssignedChallenges().then(setChallenges)
  }, [])

  return (
    <div>
      <h2>Assigned Challenges</h2>
      {challenges.map(c => (
        <div key={c.id}>
          {c.title}
        </div>
      ))}
    </div>
  )
}
