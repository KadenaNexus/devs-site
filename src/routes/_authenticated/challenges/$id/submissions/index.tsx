import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ChallengeSubmissions } from '@/features/challenges/submissions'

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
  component: ChallengeSubmissions,
})