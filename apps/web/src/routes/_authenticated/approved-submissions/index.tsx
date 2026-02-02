import { createFileRoute } from '@tanstack/react-router'
import { ApprovedSubmissions } from '@/features/dashboard/approved-submissions'

export const Route = createFileRoute('/_authenticated/approved-submissions/')({
  component: ApprovedSubmissions,
})
