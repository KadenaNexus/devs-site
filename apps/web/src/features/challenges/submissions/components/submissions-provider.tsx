import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Submission } from '../../data/submissions-schema'

type SubmissionsDialogType = 'view' | 'view-score' | 'delete'

type SubmissionsContextType = {
  open: SubmissionsDialogType | null
  setOpen: (str: SubmissionsDialogType | null) => void
  currentRow: Submission | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Submission | null>>
  userId: string | null | undefined
}

const SubmissionsContext = React.createContext<SubmissionsContextType | null>(
  null
)

export function SubmissionsProvider({
  children,
  userId,
}: {
  children: React.ReactNode
  userId: string | null | undefined
}) {
  const [open, setOpen] = useDialogState<SubmissionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Submission | null>(null)

  return (
    <SubmissionsContext
      value={{ open, setOpen, currentRow, setCurrentRow, userId }}
    >
      {children}
    </SubmissionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubmissions = () => {
  const submissionsContext = React.useContext(SubmissionsContext)

  if (!submissionsContext) {
    throw new Error('useSubmissions has to be used within <SubmissionsContext>')
  }

  return submissionsContext
}
