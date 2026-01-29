import { createFileRoute } from '@tanstack/react-router'
import { TeamGovernance } from '@/features/pages/team-and-governance'

export const Route = createFileRoute('/(pages)/team-and-governance')({
  component: TeamGovernance,
})
