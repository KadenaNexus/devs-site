import { createFileRoute } from '@tanstack/react-router'
import { MySubmissions } from '@/features/dashboard/my-submissions'

export const Route = createFileRoute('/_authenticated/my-submissions/')({
  component: MySubmissions,
})
