import { createFileRoute } from '@tanstack/react-router'
import { Winners } from '@/features/dashboard/winners'

export const Route = createFileRoute('/_authenticated/winners/')({
  component: Winners,
})
