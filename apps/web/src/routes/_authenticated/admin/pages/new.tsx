import { createFileRoute } from '@tanstack/react-router'
import { PageEditor } from '@/features/admin/pages/components/page-editor'

export const Route = createFileRoute('/_authenticated/admin/pages/new')({
  component: () => <PageEditor />,
})
