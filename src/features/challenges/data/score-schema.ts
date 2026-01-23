import { z } from 'zod'

export const scoreSchema = z.object({
  id: z.string().uuid().optional(),
  submission_id: z.string().uuid(),
  judge_user_id: z.string().uuid(),
  impact: z.number().min(0).max(100),
  execution: z.number().min(0).max(100),
  innovation: z.number().min(0).max(100),
  security: z.number().min(0).max(100),
  ux_clarity: z.number().min(0).max(100),
  notes: z.string().optional(),
  is_final: z.boolean().default(false),
  created_at: z.string().optional(),
})

export type Score = z.infer<typeof scoreSchema>
