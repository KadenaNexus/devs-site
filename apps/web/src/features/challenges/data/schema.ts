import { z } from 'zod'

export const challengeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  rules: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(), // ISO datetime string for publish date/time
  prize_pool: z.string().optional().nullable(),
  evaluation_criteria: z.string().optional().nullable(),
  sponsor_link: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.string(),
  created_by: z.string().uuid().optional().nullable(),
  created_at: z.string(),
})

export type Challenge = z.infer<typeof challengeSchema>

// Category options for challenges
export const CHALLENGE_CATEGORIES = [
  { label: 'AI & Machine Learning', value: 'AI' },
  { label: 'DeFi (Decentralized Finance)', value: 'DeFi' },
  { label: 'NFT & Digital Assets', value: 'NFT' },
  { label: 'Gaming & Metaverse', value: 'Gaming' },
  { label: 'DAO & Governance', value: 'DAO' },
  { label: 'Infrastructure & Tools', value: 'Infrastructure' },
  { label: 'DApp Development', value: 'DApp' },
  { label: 'Smart Contracts', value: 'Smart Contracts' },
  { label: 'Other', value: 'Other' },
] as const
