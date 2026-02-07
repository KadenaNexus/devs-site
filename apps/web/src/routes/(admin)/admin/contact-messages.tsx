import { createFileRoute } from '@tanstack/react-router'
import { ContactMessagesManagement } from '@/features/admin/dashboard/contact-messages'

export const Route = createFileRoute('/(admin)/admin/contact-messages')({
  component: ContactMessagesManagement,
})
