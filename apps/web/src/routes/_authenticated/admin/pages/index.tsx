import { createFileRoute } from '@tanstack/react-router'
import { PagesManagement } from '@/features/admin/pages'

export const Route = createFileRoute('/_authenticated/admin/pages/')({
  component: PagesManagement,
})
