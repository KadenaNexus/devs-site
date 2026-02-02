import { createFileRoute } from '@tanstack/react-router'
import { WinnersPage } from '@/features/pages/winners-page'

export const Route = createFileRoute('/(pages)/winners-page')({
  component: WinnersPage,
})
