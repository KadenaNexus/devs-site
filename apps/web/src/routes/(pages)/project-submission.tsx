import { createFileRoute } from '@tanstack/react-router'
import { ProjectSubmission } from '@/features/pages/project-submission'

export const Route = createFileRoute('/(pages)/project-submission')({
  component: ProjectSubmission,
})
