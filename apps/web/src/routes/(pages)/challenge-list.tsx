import { createFileRoute } from '@tanstack/react-router'
import { ChallengeList } from '@/features/pages/challenge-list'

export const Route = createFileRoute('/(pages)/challenge-list')({
  component: ChallengeList,
})
