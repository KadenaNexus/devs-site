import { createFileRoute } from '@tanstack/react-router'
import { Contact } from '@/features/pages/contact'

export const Route = createFileRoute('/(pages)/contact')({
  component: Contact,
})
