import { z } from 'zod'

export const challengeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  rules: z.string().optional(),
  timeline: z.string().optional(),
  prize_pool: z.string().optional(),
  evaluation_criteria: z.string().optional(),
  sponsor_link: z.string().optional(),
  status: z.string(),
  created_by: z.string().uuid(),
  created_at: z.string(),
})

export type Challenge = z.infer<typeof challengeSchema>