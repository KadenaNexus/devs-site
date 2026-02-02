import { createFileRoute } from '@tanstack/react-router'
import { PageEditor } from '@/features/admin/pages/components/page-editor'

export const Route = createFileRoute('/_authenticated/admin/pages/$id/edit')({
  component: () => {
    const { id } = Route.useParams()
    return <PageEditor pageId={id} />
  },
})
