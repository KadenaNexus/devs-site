import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { persistUserRole } from '@/services/auth'
import { getAssignedChallenges, type Challenge } from '@/services/judges'
import { Card } from '@/components/ui/card'

function JudgeDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    getAssignedChallenges().then(setChallenges).catch(console.error)
  }, [])
  const search = useSearch({ from: '/(auth)/sign-in' })
  const navigate = useNavigate()

  useEffect(() => {
    if (!search.role) return

    async function handleOAuthRole() {
      await persistUserRole(search.role)

      navigate({
        to: search.role === 'judge' ? '/judge-dashboard' : '/dashboard',
        replace: true,
      })
    }

    handleOAuthRole()
  }, [search.role])
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Assigned Challenges</h1>

      {challenges.map((c) => (
        <Card key={c.id} className='p-4'>
          <div className='font-medium'>{c.title}</div>
        </Card>
      ))}
    </div>
  )
}

// ✅ Export route after component
export const Route = createFileRoute('/_authenticated/judge/')({
  component: JudgeDashboard,
})
