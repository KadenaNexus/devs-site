import { createFileRoute } from '@tanstack/react-router'
import { Homepage } from '@/features/pages/homepage'

export const Route = createFileRoute('/(pages)/homepage')({
  component: () => <Homepage value="" />,
})
