import { createFileRoute } from '@tanstack/react-router'
import { ChallengeDetail } from '@/features/dashboard/challenge-detail'

export const Route = createFileRoute('/_authenticated/public-challenges/$id/')({
  component: ChallengeDetail,
})
