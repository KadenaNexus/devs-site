import { AdminLogin } from '@/features/auth/admin/components/admin-login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin-login')({
  component: AdminLogin,
})
