import { z } from 'zod'

export const contentBlockSchema = z.object({
  type: z.string(),
  data: z.record(z.any()),
})

export const pageSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable(),
  content: z.array(contentBlockSchema),
  status: z.enum(['draft', 'published', 'archived']),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  featured_image: z.string().nullable(),
  order_index: z.number(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Page = z.infer<typeof pageSchema>
export type ContentBlock = z.infer<typeof contentBlockSchema>
