import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChallengeSubmissions } from '@/features/challenges/submissions'
import { isJudgeAssignedToChallenge, getUserRole } from '@/services/authorization'

const submissionSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  status: z
    .array(z.enum(['pending', 'approved', 'rejected']))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/challenges/$id/submissions/'
)({
  validateSearch: submissionSearchSchema,
  beforeLoad: async ({ params }) => {
    const role = await getUserRole()
    const challengeId = params.id

    // Public users cannot access challenge submissions
    if (role === 'public') {
      throw redirect({
        to: '/dashboard',
        search: {
          error: 'You do not have permission to view challenge submissions',
        },
      })
    }

    // Judges can only access challenges they're assigned to
    if (role === 'judge') {
      const isAssigned = await isJudgeAssignedToChallenge(challengeId)
      if (!isAssigned) {
        throw redirect({
          to: '/judge-dashboard',
          search: {
            error: 'You are not assigned to this challenge',
          },
        })
      }
    }

    // Admins can access everything - no check needed
  },
  component: ChallengeSubmissions,
})
