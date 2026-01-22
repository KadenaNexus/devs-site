import { z } from 'zod'

export const submissionSchema = z.object({
  id: z.string().uuid(),
  challenge_id: z.string().uuid(),
  submitted_by: z.string().uuid(),
  developer_name: z.string(),
  email: z.string().email(),
  discord: z.string().optional(),
  project_title: z.string(),
  problem_statement: z.string().optional(),
  solution_description: z.string().optional(),
  github_url: z.string().url().optional(),
  demo_url: z.string().url().optional(),
  smart_contract_details: z.string().optional(),
  status: z.string(),
  is_public: z.boolean(),
  created_at: z.string(),
})

export type Submission = z.infer<typeof submissionSchema>