import { createFileRoute } from '@tanstack/react-router'
import { ChallengeDetailsPage } from '@/features/pages/challenge-details-dynamic'

export const Route = createFileRoute('/(pages)/challenge/$challengeId')({
  component: ChallengeDetailsPage,
})
