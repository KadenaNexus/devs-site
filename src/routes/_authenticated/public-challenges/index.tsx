import { createFileRoute } from '@tanstack/react-router'
import { PublicChallengesList } from '@/features/dashboard/public-challenges-list'

export const Route = createFileRoute('/_authenticated/public-challenges/')({
  component: PublicChallengesList,
})
