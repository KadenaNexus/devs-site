import { createFileRoute } from '@tanstack/react-router'
import { HowItWorks } from '@/features/pages/how-it-works'

export const Route = createFileRoute('/(pages)/how-it-works')({
  component: HowItWorks,
})
