import { createFileRoute } from '@tanstack/react-router'
import { FAQs } from '@/features/pages/faqs'

export const Route = createFileRoute('/(pages)/faqs')({
  component: FAQs,
})
