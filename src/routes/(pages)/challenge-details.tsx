import { createFileRoute } from '@tanstack/react-router'
import { ChallengeDetails } from '@/features/pages/challenge-details'

export const Route = createFileRoute('/(pages)/challenge-details')({
  component: ChallengeDetails,
})
