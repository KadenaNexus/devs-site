import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Challenges } from '@/features/challenges'
import { priorities, statuses } from '@/features/tasks/data/data'

const taskSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  status: z
    .array(z.enum(statuses.map((s) => s.value) as [string, ...string[]]))
    .optional()
    .catch([]),
  priority: z
    .array(z.enum(priorities.map((p) => p.value) as [string, ...string[]]))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/challenges/')({
  validateSearch: taskSearchSchema,
  component: Challenges,
})
