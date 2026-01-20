
import { createFileRoute } from '@tanstack/react-router'
import { JudgesSignUpForm } from '@/features/auth/sign-up/components/judges-sign-up-form'

export const Route = createFileRoute('/(auth)/judges-sign-up')({
  component: JudgesSignUpForm,
})
